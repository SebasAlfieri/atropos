'use client';

import React from 'react';
import { PanoramaViewer } from '@/components';

export default function PanoramaPage() {
  const scenes = [
    {
      id: 'scene-a',
      image: '/images/aaa.jpg',
      initialView: { yaw: 0, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-b', yaw: 45, pitch: 0, label: 'Ir a B', target: 1 },
        { id: 'to-b', yaw: 205, pitch: 0, label: 'Ir a B', target: 2 }
      ]
    },
    {
      id: 'scene-b',
      image: '/images/pieza1.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: -135, pitch: 0, label: 'Volver a A', target: 0 },
        { id: 'to-a', yaw: 0, pitch: 0, label: 'Volver a A', target: 2 }
      ]
    },
    {
      id: 'scene-c',
      image: '/images/pieza2.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: -135, pitch: 0, label: 'Volver a A', target: 0 },
        { id: 'to-a', yaw: 135, pitch: 0, label: 'Volver a A', target: 1 }
      ]
    }
  ];
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <PanoramaViewer scenes={scenes} initialSceneIndex={0} />
    </main>
  );
}
