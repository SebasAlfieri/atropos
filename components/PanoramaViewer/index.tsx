'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import s from './PanoramaViewer.module.css';

export type PanoramaViewerProps = {
  src?: string;
  fov?: number;
  scenes?: Array<{
    id?: string;
    image: string;
    initialView?: { yaw?: number; pitch?: number; fov?: number };
    hotspots?: Array<{
      id?: string;
      yaw: number; // degrees, left/right
      pitch: number; // degrees, up/down
      label?: string;
      target: number; // index of destination scene in scenes array
    }>;
  }>;
  initialSceneIndex?: number;
};

export default function PanoramaViewer({
  src,
  fov = 75,
  scenes,
  initialSceneIndex = 0
}: PanoramaViewerProps) {
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
  const meshRef = useRef<THREE.Mesh | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // scenes mode state
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(initialSceneIndex);
  const isScenesMode = !!scenes && scenes.length > 0;

  const currentScene = useMemo(() => {
    if (!isScenesMode) return null;
    const safeIndex = Math.max(0, Math.min((scenes as any).length - 1, currentSceneIndex));
    return (scenes as any)[safeIndex];
  }, [isScenesMode, scenes, currentSceneIndex]);

  const effectiveSrc = isScenesMode ? (currentScene?.image as string) : (src as string);

  useEffect(() => {
    if (!isScenesMode || !currentScene) return;
    // set initial view per-scene if provided
    if (currentScene.initialView?.yaw !== undefined) lonRef.current = currentScene.initialView.yaw;
    if (currentScene.initialView?.pitch !== undefined)
      latRef.current = currentScene.initialView.pitch;
    if (currentScene.initialView?.fov !== undefined && cameraRef.current) {
      cameraRef.current.fov = currentScene.initialView.fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [isScenesMode, currentScene]);

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
    const texture = textureLoader.load(effectiveSrc);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
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
      // update hotspot overlay positions if any
      if (
        isScenesMode &&
        currentScene &&
        currentScene.hotspots &&
        currentScene.hotspots.length > 0
      ) {
        const rendererEl = renderer.domElement;
        const width = rendererEl.clientWidth;
        const height = rendererEl.clientHeight;
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        currentScene.hotspots.forEach((hotspot: { yaw: number; pitch: number }, idx: number) => {
          const el = document.getElementById(`pv-hotspot-${idx}`) as HTMLButtonElement | null;
          if (!el) return;
          const phi = THREE.MathUtils.degToRad(90 - hotspot.pitch);
          const theta = THREE.MathUtils.degToRad(hotspot.yaw);
          const radius = 500;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          const position = new THREE.Vector3(x, y, z);

          // visibility: in front of camera
          const toPoint = position.clone().normalize();
          const facing = cameraDirection.dot(toPoint) > 0;
          if (!facing) {
            el.style.display = 'none';
            return;
          }

          const projected = position.clone().project(camera);
          if (projected.z < -1 || projected.z > 1) {
            el.style.display = 'none';
            return;
          }
          const left = ((projected.x + 1) / 2) * width;
          const top = ((-projected.y + 1) / 2) * height;
          el.style.display = 'block';
          el.style.transform = `translate(-50%, -50%) translate(${left}px, ${top}px)`;
        });
      }

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
  }, [effectiveSrc, fov, isScenesMode, currentScene]);

  const handleHotspotClick = (targetIndex: number) => {
    if (!isScenesMode) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const overlay = overlayRef.current;
    const fadeMs = 350;
    if (overlay) {
      overlay.style.transition = `opacity ${fadeMs}ms ease`;
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }

    window.setTimeout(() => {
      setCurrentSceneIndex(targetIndex);
      window.setTimeout(() => {
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
        }
        window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, fadeMs);
      }, 50);
    }, fadeMs);
  };

  return (
    <div
      className={s.container}
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}>
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 300ms ease',
          zIndex: 2
        }}
      />
      {isScenesMode &&
        currentScene?.hotspots?.map((h: { target: number; label?: string }, i: number) => (
          <button
            className={s.container__hotspot}
            key={i}
            id={`pv-hotspot-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(h.target);
            }}>
            <div className={s.container__hotspot__ring}></div>
          </button>
        ))}
    </div>
  );
}
