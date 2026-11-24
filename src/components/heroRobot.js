import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import { useTheme } from '@contexts/ThemeContext';

/*
 * DexterLab hero: a UR5e arm + Allegro hand replaying Daksh's own teleoperated pick-and-place demos.
 *
 * Assets in static/dexterlab/ are exported from MuJoCo by tools/dexterlab/export_web.py:
 *   dexterlab.glb  - geometry, one node per body ("<body>__<material>")
 *   dexterlab.bin.gz - int16 body poses per frame, frame-delta encoded + gzipped (see dexterlab.json)
 *   poster-*.webp  - still frames shown until (or instead of) the live 3D scene
 *
 * three.js and the assets are only fetched after the page has loaded and the browser is idle, and
 * never when WebGL is unavailable or the visitor has data-saver / a slow connection.
 */

const ASSET_DIR = '/dexterlab';
const MAX_FPS = 30; // poses are recorded at 20 Hz and interpolated, so 30 fps looks smooth
const GHOSTS = [
  { lag: 4, opacity: 0.08 },
  { lag: 8, opacity: 0.035 },
];
// Bodies without a ghost copy: static scenery and the cube.
const NO_GHOST = new Set(['base', 'pp_platform', 'pp_container', 'pp_cube']);
// Initial viewing direction (three.js coords, y-up), roughly the W&B evaluation camera angle.
const VIEW_DIR = [0.85, 0.55, 1.25];

const PALETTES = {
  dark: {
    linkgray: '#ECDFCC',
    white: '#ECDFCC',
    urblue: '#A9B4B0',
    jointgray: '#4A4D49',
    black: '#2A2C29',
    hand_black: '#5A5D58',
    pp_cube: '#E07A5F',
    container: '#ECDFCC',
    pp_platform: '#6E6457',
    ghost: '#ECDFCC',
    key: 0xfff4e6,
    ground: 0x8899aa,
  },
  light: {
    linkgray: '#3B3C38',
    white: '#3B3C38',
    urblue: '#71807B',
    jointgray: '#1E201E',
    black: '#111211',
    hand_black: '#262825',
    pp_cube: '#D0573A',
    container: '#1E201E',
    pp_platform: '#B3A48E',
    ghost: '#1E201E',
    key: 0xffffff,
    ground: 0xbfb4a3,
  },
};

const StyledStage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;

  .poster,
  canvas {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
  }

  .poster {
    object-fit: contain;
    pointer-events: none; /* it sits on top of the canvas: let drags reach the 3D controls */
    transition: opacity 0.6s ease;
  }
  .poster.light {
    display: none;
  }
  :root[data-theme='light'] & .poster.dark {
    display: none;
  }
  :root[data-theme='light'] & .poster.light {
    display: block;
  }

  canvas {
    display: block;
    opacity: 0;
    transition: opacity 0.6s ease;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &.is-live {
    canvas {
      opacity: 1;
    }
    .poster {
      opacity: 0;
    }
  }

  .demo-pills {
    position: absolute;
    left: 50%;
    bottom: 6%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--color-accent-tint);
    border-radius: 999px;
    background: rgba(var(--color-bg-primary-rgb), 0.6);
    backdrop-filter: blur(6px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.6s ease 0.3s;
  }
  &.is-live .demo-pills {
    opacity: 1;
    visibility: visible;
  }

  .demo-pills button {
    min-width: 36px;
    min-height: 32px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    transition: var(--transition);

    &:hover {
      color: var(--color-text-primary);
    }
    &[aria-pressed='true'] {
      background: var(--color-text-primary);
      color: var(--color-bg-primary);
    }
  }
`;

const canUseWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (e) {
    return false;
  }
};

// Pose file: gzipped int16 data (see tools/dexterlab/export_web.py). Some servers already undo the
// gzip (Content-Encoding), so only decompress when the gzip magic bytes are still there.
const loadPoses = async response => {
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    return new Int16Array(bytes.buffer);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Int16Array(await new Response(stream).arrayBuffer());
};

// Poses are stored as differences from the previous frame (wrapping 16-bit); rebuild absolutes.
// Int16Array assignment wraps the same way the encoder did.
const undoFrameDelta = (data, stride) => {
  for (let i = stride; i < data.length; i++) {
    data[i] += data[i - stride];
  }
};

const isConstrainedNetwork = () => {
  const c = navigator.connection;
  return !!c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || ''));
};

const HeroRobot = () => {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const [live, setLive] = useState(false);
  const [demo, setDemo] = useState(0);
  const [demoCount, setDemoCount] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!canUseWebGL() || isConstrainedNetwork() || typeof DecompressionStream === 'undefined') {
      return undefined; // the poster image stays
    }

    let disposed = false;
    let cleanup = () => {};

    const boot = async () => {
      const [THREE, { GLTFLoader }, { OrbitControls }, { MeshoptDecoder }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
      ]);
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder); // geometry is meshopt-compressed
      const [gltf, meta, poses] = await Promise.all([
        loader.loadAsync(withPrefix(`${ASSET_DIR}/dexterlab.glb`)),
        fetch(withPrefix(`${ASSET_DIR}/dexterlab.json`)).then(r => r.json()),
        fetch(withPrefix(`${ASSET_DIR}/dexterlab.bin.gz`)).then(loadPoses),
      ]);
      const mount = mountRef.current;
      if (disposed || !mount) {
        return;
      }

      const bodyCount = meta.bodies.length;
      undoFrameDelta(poses, bodyCount * 7);
      const bodyIndex = Object.fromEntries(meta.bodies.map((b, i) => [b, i]));
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // ---------- renderer & scene ----------
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute(
        'aria-label',
        `A UR5e robot arm with an Allegro hand replaying Daksh's teleoperated pick-and-place demonstrations`,
      );
      mount.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
      const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.4);
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(1.5, 2.5, 2);
      const fill = new THREE.DirectionalLight(0xffffff, 0.8);
      fill.position.set(-2, 1, -1.5);
      scene.add(hemi, key, fill);

      // MuJoCo is z-up, three.js is y-up.
      const root = new THREE.Group();
      root.rotation.x = -Math.PI / 2;
      scene.add(root);

      // One pivot per body; we write world poses straight into them every frame.
      const pivots = meta.bodies.map(() => new THREE.Group());
      pivots.forEach(p => root.add(p));
      const materials = {};
      const geometries = [];
      gltf.scene.traverse(obj => {
        if (!obj.isMesh) {
          return;
        }
        const [body, matName] = obj.name.split('__');
        const i = bodyIndex[body];
        if (i === undefined) {
          return;
        }
        const name = matName || obj.material.name;
        if (!materials[name]) {
          const isContainer = name === 'container';
          materials[name] = new THREE.MeshStandardMaterial({
            roughness: name === 'pp_cube' ? 0.45 : 0.55,
            metalness: 0.05,
            transparent: isContainer,
            opacity: isContainer ? 0.38 : 1,
            depthWrite: !isContainer,
          });
        }
        // Keep the node's own transform: mesh quantisation stores a per-node offset + scale.
        const mesh = new THREE.Mesh(obj.geometry, materials[name]);
        mesh.position.copy(obj.position);
        mesh.quaternion.copy(obj.quaternion);
        mesh.scale.copy(obj.scale);
        pivots[i].add(mesh);
        geometries.push(obj.geometry);
      });

      // Ghost trail: translucent copies of the moving robot that lag a few frames behind.
      const ghostMaterials = GHOSTS.map(
        g =>
          new THREE.MeshBasicMaterial({ transparent: true, opacity: g.opacity, depthWrite: false }),
      );
      const ghostPivots = GHOSTS.map((g, gi) =>
        meta.bodies.map((body, i) => {
          const p = new THREE.Group();
          if (!NO_GHOST.has(body)) {
            pivots[i].children.forEach(m => {
              const ghost = new THREE.Mesh(m.geometry, ghostMaterials[gi]);
              ghost.position.copy(m.position);
              ghost.quaternion.copy(m.quaternion);
              ghost.scale.copy(m.scale);
              p.add(ghost);
            });
            root.add(p);
          }
          return p;
        }),
      );

      const applyPalette = dark => {
        const pal = PALETTES[dark ? 'dark' : 'light'];
        Object.entries(materials).forEach(([n, m]) => m.color.set(pal[n] || pal.linkgray));
        ghostMaterials.forEach(m => m.color.set(pal.ghost));
        key.color.setHex(pal.key);
        hemi.groundColor.setHex(pal.ground);
      };

      // ---------- poses ----------
      const qa = new THREE.Quaternion();
      const qb = new THREE.Quaternion();
      const pa = [0, 0, 0];
      const pb = [0, 0, 0];
      const readPose = (frame, body, p, q) => {
        const o = (frame * bodyCount + body) * 7;
        p[0] = poses[o] * meta.posScale;
        p[1] = poses[o + 1] * meta.posScale;
        p[2] = poses[o + 2] * meta.posScale;
        // stored as MuJoCo (w, x, y, z)
        q.set(
          poses[o + 4] * meta.quatScale,
          poses[o + 5] * meta.quatScale,
          poses[o + 6] * meta.quatScale,
          poses[o + 3] * meta.quatScale,
        );
      };
      // Interpolated pose at fractional frame f, clamped to [lo, hi).
      const applyPoses = (targets, f, lo, hi) => {
        const f0 = Math.max(lo, Math.min(hi - 1, Math.floor(f)));
        const f1 = Math.min(hi - 1, f0 + 1);
        const t = Math.max(0, Math.min(1, f - f0));
        for (let i = 0; i < bodyCount; i++) {
          const node = targets[i];
          if (node.parent) {
            readPose(f0, i, pa, qa);
            readPose(f1, i, pb, qb);
            node.position.set(
              pa[0] + (pb[0] - pa[0]) * t,
              pa[1] + (pb[1] - pa[1]) * t,
              pa[2] + (pb[2] - pa[2]) * t,
            );
            node.quaternion.copy(qa).slerp(qb, t);
          }
        }
      };

      // ---------- camera: fit everything the demos ever touch, at any aspect ratio ----------
      const bounds = new THREE.Box3();
      const v = new THREE.Vector3();
      for (let f = 0; f < meta.frames; f += 4) {
        for (let b = 0; b < bodyCount; b++) {
          readPose(f, b, pa, qa);
          bounds.expandByPoint(v.set(pa[0], pa[2], -pa[1])); // z-up -> y-up
        }
      }
      bounds.expandByScalar(0.12); // body origins -> mesh extents
      const sphere = bounds.getBoundingSphere(new THREE.Sphere());

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.copy(sphere.center);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.6;
      controls.minPolarAngle = Math.PI * 0.18;
      controls.maxPolarAngle = Math.PI * 0.47;
      // OrbitControls sets touch-action: none; restore vertical page scrolling on touch screens.
      renderer.domElement.style.touchAction = 'pan-y';

      const fitCamera = () => {
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        const distance = (sphere.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.7;
        const dir = camera.position.clone().sub(controls.target);
        if (dir.lengthSq() < 1e-6) {
          dir.set(...VIEW_DIR);
        }
        camera.position.copy(controls.target).addScaledVector(dir.normalize(), distance);
        camera.near = distance / 20;
        camera.far = distance * 4;
        camera.updateProjectionMatrix();
        controls.update();
      };

      // ---------- render loop (only runs while visible) ----------
      const state = { demo: 0, t: 0, last: 0, raf: 0, visible: false };
      const setDemoIndex = i => {
        state.demo = i;
        state.t = 0;
        setDemo(i);
      };

      const draw = () => {
        const [lo, hi] = meta.demos[state.demo];
        const f = lo + state.t * meta.fps;
        applyPoses(pivots, f, lo, hi);
        GHOSTS.forEach((g, gi) => applyPoses(ghostPivots[gi], Math.max(lo, f - g.lag), lo, hi));
        controls.update();
        renderer.render(scene, camera);
      };

      const tick = now => {
        state.raf = requestAnimationFrame(tick);
        if (now - state.last < 1000 / MAX_FPS - 1) {
          return;
        }
        const dt = state.last ? Math.min(0.1, (now - state.last) / 1000) : 0;
        state.last = now;
        state.t += dt;
        const [lo, hi] = meta.demos[state.demo];
        if (lo + state.t * meta.fps >= hi - 1) {
          setDemoIndex((state.demo + 1) % meta.demos.length);
        }
        draw();
      };

      const start = () => {
        if (!state.raf && !reduceMotion) {
          state.last = 0;
          state.raf = requestAnimationFrame(tick);
        }
      };
      const stop = () => {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      };

      const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (!w || !h) {
          return;
        }
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        fitCamera();
        draw();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      const visibility = new IntersectionObserver(([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible && !document.hidden) {
          start();
        } else {
          stop();
        }
      });
      visibility.observe(mount);
      const onVisibilityChange = () => (document.hidden || !state.visible ? stop() : start());
      document.addEventListener('visibilitychange', onVisibilityChange);

      // Reduced motion: a still pose, redrawn only when the visitor drags.
      if (reduceMotion) {
        const [lo, hi] = meta.demos[0];
        state.t = ((hi - lo) * 0.55) / meta.fps;
        controls.addEventListener('change', () => renderer.render(scene, camera));
      }

      camera.position.set(...VIEW_DIR);
      applyPalette(document.documentElement.dataset.theme !== 'light');
      resize();

      apiRef.current = {
        applyPalette: dark => {
          applyPalette(dark);
          draw();
        },
        setDemoIndex: i => {
          setDemoIndex(i);
          draw();
        },
      };
      setDemoCount(meta.demos.length);
      setLive(true);

      cleanup = () => {
        stop();
        visibility.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        controls.dispose();
        geometries.forEach(g => g.dispose());
        Object.values(materials).forEach(m => m.dispose());
        ghostMaterials.forEach(m => m.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    };

    // Wait for the page to finish loading and the browser to go idle.
    let idleHandle = null;
    const schedule = () => {
      const run = () =>
        boot().catch(err => console.warn(`HeroRobot: ${err && (err.message || err)}`));
      idleHandle = window.requestIdleCallback
        ? { idle: window.requestIdleCallback(run, { timeout: 3000 }) }
        : { timer: setTimeout(run, 300) };
    };
    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener('load', schedule);
      if (idleHandle && idleHandle.idle) {
        window.cancelIdleCallback(idleHandle.idle);
      }
      if (idleHandle && idleHandle.timer) {
        clearTimeout(idleHandle.timer);
      }
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.applyPalette(isDark);
    }
  }, [isDark, live]);

  return (
    <StyledStage ref={mountRef} className={live ? 'is-live' : undefined}>
      <img
        className="poster dark"
        src={withPrefix(`${ASSET_DIR}/poster-dark.webp`)}
        alt=""
        aria-hidden="true"
        // The poster is the page's largest element on load: fetch it first. (React 18 passes the
        // lowercase attribute through; React 19 adds `fetchPriority`.)
        // eslint-disable-next-line react/no-unknown-property
        fetchpriority="high"
      />
      <img
        className="poster light"
        src={withPrefix(`${ASSET_DIR}/poster-light.webp`)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      {demoCount > 0 && (
        <div className="demo-pills" role="group" aria-label="Choose a teleoperation demo">
          {Array.from({ length: demoCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === demo}
              aria-label={`Demo ${i + 1}`}
              onClick={() => apiRef.current && apiRef.current.setDemoIndex(i)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </StyledStage>
  );
};

export default HeroRobot;
