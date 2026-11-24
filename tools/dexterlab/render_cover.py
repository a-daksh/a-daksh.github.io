"""Render DexterLab teleop demos to PNG frames for the project cover video.

Replays recorded demos exactly (snapshot of qpos/qvel per step), then simulates a short release
(fingers return to the demo's starting pose) so the cube visibly drops into the container.
Uses MuJoCo's default free camera angle (same view as the W&B eval videos), moved closer.

Run inside the DexterLab repo environment (needs mujoco + dexterlab installed), headless:
    MUJOCO_GL=osmesa python render_cover.py --demos-dir <DexterLab>/data/demos/pick_and_place --out frames/
Then turn the frames into the cover with:
    tools/media/make-cover.sh frames/ content/featured/Project7 --frame-rate 10
"""
import argparse
import os

import h5py
import mujoco
import numpy as np
from PIL import Image

from dexterlab.dataset.loader import _build_model

DEFAULT_DEMOS = ["224213", "224314", "224908", "231334", "231502"]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--demos-dir", required=True)
    ap.add_argument("--out", required=True, help="output folder for PNG frames")
    ap.add_argument("--demos", nargs="+", default=DEFAULT_DEMOS, help="demo timestamps (Daksh_20260427_<ts>.h5)")
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--step", type=int, default=2, help="keep every Nth 20 Hz frame (2 = 10 fps = 2x speed at 20 fps)")
    ap.add_argument("--zoom", type=float, default=0.5, help="camera distance as a fraction of MuJoCo's default")
    ap.add_argument("--lookat", type=float, nargs=3, default=[-0.32, 0.0, 0.18], help="camera target (world, m)")
    ap.add_argument("--release-s", type=float, default=1.5)
    ap.add_argument("--hold-s", type=float, default=0.5)
    ap.add_argument("--max-frames", type=int, default=0, help="stop early (for quick tests)")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    model, data, task = _build_model("pick_and_place", "right")
    model.vis.global_.offwidth, model.vis.global_.offheight = args.width, args.height
    renderer = mujoco.Renderer(model, args.height, args.width)
    cam = mujoco.MjvCamera()
    mujoco.mjv_defaultFreeCamera(model, cam)
    cam.distance *= args.zoom
    cam.lookat[:] = args.lookat

    n_mocap = model.nmocap
    ctrl_hz = 20.0
    substeps = int(round(1.0 / ctrl_hz / model.opt.timestep))
    count = {"seen": 0, "saved": 0}

    def frame():
        if count["seen"] % args.step == 0:
            task.update_visuals()
            renderer.update_scene(data, camera=cam)
            Image.fromarray(renderer.render()).save(os.path.join(args.out, f"f{count['saved']:05d}.png"))
            count["saved"] += 1
        count["seen"] += 1
        return args.max_frames and count["saved"] >= args.max_frames

    for name in args.demos:
        with h5py.File(os.path.join(args.demos_dir, f"Daksh_20260427_{name}.h5"), "r") as f:
            states, actions, attrs = f["states"][:], f["actions"][:], dict(f.attrs)
        mocap_pos = np.array(attrs["initial_mocap_pos"]).reshape(-1, 3)
        mocap_quat = np.array(attrs["initial_mocap_quat"]).reshape(-1, 4)
        mujoco.mj_resetData(model, data)
        # teleop recordings store extra marker bodies first; the task's mocap bodies are the last ones
        data.mocap_pos[:] = mocap_pos[-n_mocap:]
        data.mocap_quat[:] = mocap_quat[-n_mocap:]
        for t in range(len(states)):  # exact recorded states
            data.qpos[:] = states[t][: model.nq]
            data.qvel[:] = states[t][model.nq:]
            mujoco.mj_forward(model, data)
            if frame():
                return
        data.qvel[:] = 0
        mujoco.mj_forward(model, data)
        data.ctrl[:6] = data.qpos[:6]           # hold the arm
        data.ctrl[6:22] = actions[0, 6:22]      # open the hand (demo's starting finger pose)
        for _ in range(int(args.release_s * ctrl_hz)):
            for _ in range(substeps):
                mujoco.mj_step(model, data)
            if frame():
                return
        for _ in range(int(args.hold_s * ctrl_hz)):
            if frame():
                return
        print(f"{name}: success after release = {task.is_success()}", flush=True)
    print(f"saved {count['saved']} frames to {args.out}")


if __name__ == "__main__":
    main()
