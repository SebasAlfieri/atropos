'use client';

import React, { useState } from 'react';
import { PanoramaViewer } from '@/components';

export default function PanoramaPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  const scenes = [
    {
      id: '1',
      image: '/images/dji_export_20260121_152950_1769030990346_sphere_screenshot.jpg',
      initialView: { yaw: 180, pitch: 0, fov: 75 },
      hotspots: [
        // { id: 'to-b', yaw: 45, pitch: 0, label: 'Ir a B', target: 1 },
        { id: 'to-b', yaw: 205, pitch: 0, label: 'Ir a B', target: 1 }
      ]
    },
    {
      id: '2',
      image: '/images/dji_fly_20260121_150604_54_1769030367509_pano_optimized.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: 0, pitch: 50, label: 'Volver a A', target: 0 },
        { id: 'to-a', yaw: 0, pitch: 0, label: 'Volver a A', target: 2 }
      ]
    },
    {
      id: '3',
      image: '/images/dji_fly_20260121_150718_55_1769030313699_pano_optimized.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: -135, pitch: 0, label: 'Volver a A', target: 1 },
        { id: 'to-a', yaw: 135, pitch: 0, label: 'Volver a A', target: 3 }
      ]
    },
    {
      id: '4',
      image: '/images/dji_fly_20260121_150838_56_1769030691914_pano_optimized.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: -135, pitch: 0, label: 'Volver a A', target: 2 },
        { id: 'to-a', yaw: 135, pitch: 0, label: 'Volver a A', target: 4 }
      ]
    },
    {
      id: '5',
      image: '/images/dji_fly_20260121_150942_57_1769031104219_pano_optimized.jpg',
      initialView: { yaw: -30, pitch: 0, fov: 75 },
      hotspots: [
        { id: 'to-a', yaw: -135, pitch: 0, label: 'Volver a A', target: 3 },
        { id: 'to-a', yaw: 135, pitch: 0, label: 'Volver a A', target: 5 }
      ]
    }
  ];

  const currentSceneImage = `${scenes[currentSceneIndex]?.id || 'unknown'} ${scenes[currentSceneIndex]?.image?.slice(8) || 'unknown'}`;

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <p
        style={{
          position: 'absolute',
          color: 'white',
          top: 0,
          left: 0,
          zIndex: 10,
          fontSize: '25px'
        }}>
        {currentSceneImage}
      </p>
      <PanoramaViewer scenes={scenes} initialSceneIndex={0} onSceneChange={setCurrentSceneIndex} />
    </main>
  );
}
