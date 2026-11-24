"""Export the DexterLab scene for the website's 3D hero (src/components/heroRobot.js).

Writes to --out (normally static/dexterlab/):
  dexterlab.glb      one node per MuJoCo body (body-local geometry), merged per material, decimated
  dexterlab.bin.gz   per-frame body poses for the teleop demos (+ simulated release), see layout below
  dexterlab.json     metadata: body order, per-demo frame ranges, fps, quantisation scales, credits

Run inside the DexterLab repo environment (needs mujoco, dexterlab, trimesh, fast-simplification):
    MUJOCO_GL=osmesa python export_web.py --demos-dir <DexterLab>/data/demos/pick_and_place --out static/dexterlab
then compress the geometry (from the website repo, needs Node):
    yarn compress:3d   (gltf-transform meshopt: quantise + compress, about 4x smaller)

Pose layout: frames x bodies x [px, py, pz, qw, qx, qy, qz], little-endian int16,
  position = value * posScale (metres, MuJoCo world frame, z-up); quaternion = value * quatScale (w, x, y, z).
Stored frame-delta encoded (each frame minus the previous one, wrapping in 16 bits; frame 0 as-is)
and gzipped, which roughly halves the download. heroRobot.js undoes both.
"""
import gzip
import argparse
import json
import os

import h5py
import mujoco
import numpy as np
import trimesh

from dexterlab.dataset.loader import _build_model

DEFAULT_DEMOS = ["224213", "224314", "224908", "231334", "231502"]
FPS = 20
POS_SCALE = 1e-4  # int16 position step = 0.1 mm
CREDITS = ("UR5e model (c) 2018 ROS-Industrial Consortium, BSD-3-Clause; "
           "Allegro hand model (c) 2016 SimLab, BSD-2-Clause; via MuJoCo Menagerie. "
           "See static/dexterlab/THIRD_PARTY_NOTICES.txt")


def geom_mesh(model, i):
    """Return the geom as a trimesh in its body's frame, or None for unsupported types."""
    t, s = model.geom_type[i], model.geom_size[i]
    if t == mujoco.mjtGeom.mjGEOM_MESH:
        m = model.geom_dataid[i]
        va, vn = model.mesh_vertadr[m], model.mesh_vertnum[m]
        fa, fn = model.mesh_faceadr[m], model.mesh_facenum[m]
        mesh = trimesh.Trimesh(model.mesh_vert[va:va + vn].copy(), model.mesh_face[fa:fa + fn].copy(), process=True)
    elif t == mujoco.mjtGeom.mjGEOM_BOX:
        mesh = trimesh.creation.box(extents=2 * s[:3])
        mesh.unmerge_vertices()  # flat-shaded faces for crisp boxes
    elif t == mujoco.mjtGeom.mjGEOM_CYLINDER:
        mesh = trimesh.creation.cylinder(radius=s[0], height=2 * s[1], sections=32)
    elif t == mujoco.mjtGeom.mjGEOM_SPHERE:
        mesh = trimesh.creation.icosphere(radius=s[0], subdivisions=2)
    elif t == mujoco.mjtGeom.mjGEOM_CAPSULE:
        mesh = trimesh.creation.capsule(radius=s[0], height=2 * s[1], count=[16, 16])
    else:
        return None
    T = np.eye(4)
    T[:3, :3] = trimesh.transformations.quaternion_matrix(model.geom_quat[i])[:3, :3]
    T[:3, 3] = model.geom_pos[i]
    mesh.apply_transform(T)
    return mesh


def material_of(model, i):
    m = model.geom_matid[i]
    if m >= 0:
        return model.material(m).name, model.mat_rgba[m]
    return model.geom(i).name.replace("_geom", "") or "default", model.geom_rgba[i]


def export_geometry(model, out, target_faces):
    """Visual geoms only: robot meshes (group 2) + task objects; skip floor and the cube's shadow helper."""
    parts, colors = {}, {}
    for i in range(model.ngeom):
        name = model.geom(i).name
        if model.geom_group[i] == 3 or model.geom_type[i] == mujoco.mjtGeom.mjGEOM_PLANE or "shadow" in name:
            continue
        mesh = geom_mesh(model, i)
        if mesh is None:
            continue
        body = model.body(model.geom_bodyid[i]).name
        mname, rgba = material_of(model, i)
        if mname.startswith("pp_container"):
            mname = "container"
        parts.setdefault((body, mname), []).append(mesh)
        colors[mname] = [float(x) for x in rgba]

    scene = trimesh.Scene()
    before = after = 0
    for (body, mname), meshes in parts.items():
        mesh = trimesh.util.concatenate(meshes)
        before += len(mesh.faces)
        if len(mesh.faces) > target_faces:
            mesh = mesh.simplify_quadric_decimation(face_count=target_faces)
        after += len(mesh.faces)
        mesh.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
            name=mname, baseColorFactor=colors[mname], metallicFactor=0.1, roughnessFactor=0.6))
        scene.add_geometry(mesh, node_name=f"{body}__{mname}", geom_name=f"{body}__{mname}")
    scene.metadata["copyright"] = CREDITS
    glb = scene.export(file_type="glb", include_normals=True)
    with open(os.path.join(out, "dexterlab.glb"), "wb") as f:
        f.write(glb)
    print(f"faces {before} -> {after}; glb {len(glb) / 1024:.0f} KB")
    bodies = sorted({b for b, _ in parts}, key=lambda n: model.body(n).id)
    return bodies, colors


def export_motion(model, data, task, bodies, demos_dir, demos):
    """Same replay as the cover video: exact recorded states, then a simulated release."""
    body_ids = [model.body(b).id for b in bodies]
    n_mocap = model.nmocap
    substeps = int(round(1.0 / FPS / model.opt.timestep))
    frames, ranges = [], []

    def grab():
        frames.append(np.concatenate([data.xpos[body_ids], data.xquat[body_ids]], axis=1))

    for name in demos:
        with h5py.File(os.path.join(demos_dir, f"Daksh_20260427_{name}.h5"), "r") as f:
            states, actions, attrs = f["states"][:], f["actions"][:], dict(f.attrs)
        p = np.array(attrs["initial_mocap_pos"]).reshape(-1, 3)
        q = np.array(attrs["initial_mocap_quat"]).reshape(-1, 4)
        mujoco.mj_resetData(model, data)
        data.mocap_pos[:] = p[-n_mocap:]
        data.mocap_quat[:] = q[-n_mocap:]
        start = len(frames)
        for t in range(len(states)):
            data.qpos[:] = states[t][: model.nq]
            data.qvel[:] = states[t][model.nq:]
            mujoco.mj_forward(model, data)
            grab()
        data.qvel[:] = 0
        mujoco.mj_forward(model, data)
        data.ctrl[:6] = data.qpos[:6]
        data.ctrl[6:22] = actions[0, 6:22]
        for _ in range(int(1.5 * FPS)):
            for _ in range(substeps):
                mujoco.mj_step(model, data)
            grab()
        for _ in range(int(0.5 * FPS)):
            grab()
        ranges.append([start, len(frames)])
        print(f"{name}: {len(frames) - start} frames, success={task.is_success()}")
    return np.stack(frames), ranges


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--demos-dir", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--demos", nargs="+", default=DEFAULT_DEMOS)
    ap.add_argument("--target-faces", type=int, default=800, help="max faces per merged (body, material) mesh")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    model, data, task = _build_model("pick_and_place", "right")
    mujoco.mj_forward(model, data)
    bodies, colors = export_geometry(model, args.out, args.target_faces)
    F, ranges = export_motion(model, data, task, bodies, args.demos_dir, args.demos)

    assert np.abs(F[..., :3]).max() < 3.2, "positions exceed int16 range at POS_SCALE"
    pos = np.round(F[..., :3] / POS_SCALE).astype("<i2")
    quat = np.round(F[..., 3:] * 32767).astype("<i2")
    poses = np.concatenate([pos, quat], axis=-1)  # (frames, bodies, 7) int16

    # Frame-delta encode in wrapping 16-bit arithmetic, then gzip (decoded in heroRobot.js).
    u = poses.view("<u2")
    delta = u.copy()
    delta[1:] = u[1:] - u[:-1]
    blob = gzip.compress(delta.tobytes(), compresslevel=9, mtime=0)
    with open(os.path.join(args.out, "dexterlab.bin.gz"), "wb") as f:
        f.write(blob)

    meta = {"fps": FPS, "bodies": bodies, "demos": ranges, "frames": int(F.shape[0]),
            "posScale": POS_SCALE, "quatScale": 1 / 32767,
            "layout": "frame,body,[px,py,pz,qw,qx,qy,qz] int16 LE, frame-delta encoded, gzip",
            "colors": colors, "zUp": True, "credits": CREDITS}
    with open(os.path.join(args.out, "dexterlab.json"), "w") as f:
        json.dump(meta, f)
    print(f"poses {len(blob) / 1024:.0f} KB gzipped ({poses.nbytes / 1024:.0f} KB raw), "
          f"{F.shape[0]} frames x {F.shape[1]} bodies")


if __name__ == "__main__":
    main()
