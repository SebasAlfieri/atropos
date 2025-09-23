'use client';

import React from 'react';
import { PanoramaViewer } from '@/components';

export default function PanoramaPage() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <PanoramaViewer src="/images/testthree.jpg" />
    </main>
  );
}
