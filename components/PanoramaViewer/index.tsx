'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type PanoramaViewerProps = {
  src: string;
  fov?: number;
};

export default function PanoramaViewer({ src, fov = 75 }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const phiRef = useRef<number>(0);
  const thetaRef = useRef<number>(0);
  const pointerXRef = useRef<number>(0);
  const pointerYRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.set(0, 0, 0.1);

    let rafId: number;
    const animate = () => {
      const lat = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - lat);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const x = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const y = 500 * Math.cos(phiRef.current);
      const z = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const onPointerDown = (event: PointerEvent) => {
      isDraggingRef.current = true;
      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;
      (event.target as Element).setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const movementX = event.clientX - pointerXRef.current;
      const movementY = event.clientY - pointerYRef.current;
      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;
      lonRef.current -= movementX * 0.1;
      latRef.current += movementY * 0.1;
    };

    const onPointerUp = (event: PointerEvent) => {
      isDraggingRef.current = false;
      (event.target as Element).releasePointerCapture(event.pointerId);
    };

    const onWheel = (event: WheelEvent) => {
      const newFov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.05, 30, 100);
      camera.fov = newFov;
      camera.updateProjectionMatrix();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = 1.5;
      if (event.key === 'ArrowLeft') lonRef.current -= step;
      if (event.key === 'ArrowRight') lonRef.current += step;
      if (event.key === 'ArrowUp') latRef.current -= step;
      if (event.key === 'ArrowDown') latRef.current += step;
    };

    window.addEventListener('resize', onResize);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel as EventListener);
      window.removeEventListener('keydown', onKeyDown);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement === container) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
      texture.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
    };
  }, [src, fov]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}
    />
  );
}
