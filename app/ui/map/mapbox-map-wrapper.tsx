'use client';

import dynamic from 'next/dynamic';

// `ssr: false` is only valid inside a Client Component.
// This wrapper exists solely to apply that constraint so the Server Component
// at app/dashboard/orders/[id]/details/page.tsx can import it safely.
const MapboxMap = dynamic(() => import('./mapbox-map'), { ssr: false });

export default MapboxMap;
