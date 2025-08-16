import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const GalaxyOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #020c1b; /* Dark navy from website theme */
  z-index: 9999;
  overflow: hidden;
  
  /* Simple blur overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(1.25px);
    z-index: 10000;
    pointer-events: none;
  }
`;

const GalaxyCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8); /* Navy background */
  border: 1px solid #fff  ; /* Teal accent border */
  color: #fff; /* Teal accent text */
  padding: 10px 15px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  z-index: 10002;
  border-radius: 4px;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  
  &:hover {
    background: rgba(100, 255, 218, 0.1); /* Teal tint on hover */
    transform: translateY(-2px);
  }
`;

const Galaxy = ({ onClose }) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  // ESC key detection
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const loadThreeJS = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.THREE) {
          resolve();
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/three@0.132.2/build/three.min.js';
        script.onload = () => {
          // Load OrbitControls
          const controlsScript = document.createElement('script');
          controlsScript.src = 'https://unpkg.com/three@0.132.2/examples/js/controls/OrbitControls.js';
          controlsScript.onload = resolve;
          controlsScript.onerror = reject;
          document.head.appendChild(controlsScript);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeGalaxy = async () => {
      try {
        await loadThreeJS();

        const THREE = window.THREE;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Galaxy parameters
        const parameters = {
          count: 100000,
          size: 0.01,
          radius: 2.15,
          branches: 8,
          spin: 5,
          randomness: 5,
          randomnessPower: 4,
          insideColor: '#ff6030',
          outsideColor: '#0949f0'
        };

        let material = null;
        let geometry = null;
        let points = null;

        const generateGalaxy = () => {
          if (points !== null) {
            geometry.dispose();
            material.dispose();
            scene.remove(points);
          }

          material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
          });

          geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(parameters.count * 3);
          const colors = new Float32Array(parameters.count * 3);
          const colorInside = new THREE.Color(parameters.insideColor);
          const colorOutside = new THREE.Color(parameters.outsideColor);

          for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius = Math.pow(Math.random() * parameters.randomness, Math.random() * parameters.radius);
            const spinAngle = radius * parameters.spin;
            const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
            const negPos = [1, -1];
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)];
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)];
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)];

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, Math.random() * radius / parameters.radius);
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
          }

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          points = new THREE.Points(geometry, material);
          scene.add(points);
        };

        generateGalaxy();

        // Sizes
        const sizes = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.x = 5;  // Change this value (left/right)
        camera.position.y = 2;  // Change this value (up/down)
        camera.position.z = 5;  // Change this value (forward/back)
        scene.add(camera);
        cameraRef.current = camera;

        // Controls
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Resize handler
        const handleResize = () => {
          sizes.width = window.innerWidth;
          sizes.height = window.innerHeight;
          camera.aspect = sizes.width / sizes.height;
          camera.updateProjectionMatrix();
          renderer.setSize(sizes.width, sizes.height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        // Animation
        const clock = new THREE.Clock();
        const tick = () => {
          const elapsedTime = clock.getElapsedTime();

          // Update controls
          controls.update();
          camera.position.x = Math.cos(elapsedTime * 0.05);
          camera.position.z = Math.sin(elapsedTime * 0.05);
          camera.lookAt(0, 0, 0);

          // Render
          renderer.render(scene, camera);

          // Call tick again on the next frame
          animationIdRef.current = window.requestAnimationFrame(tick);
        };

        tick();

        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationIdRef.current) {
            window.cancelAnimationFrame(animationIdRef.current);
          }
          if (geometry) geometry.dispose();
          if (material) material.dispose();
          if (renderer) renderer.dispose();
        };

      } catch (error) {
        console.error('Failed to load Three.js:', error);
      }
    };

    const cleanup = initializeGalaxy();

    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, []);

  return (
    <GalaxyOverlay>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <GalaxyCanvas ref={canvasRef} className="webgl" />
    </GalaxyOverlay>
  );
};

export default Galaxy;