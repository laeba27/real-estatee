'use client';
import { useState, Suspense } from 'react';
import PropertyList from '@/app/_components/PropertyList';
import dynamic from 'next/dynamic';
import { saleProperties } from '@/app/_data/properties';

const MapViewNoSSR = dynamic(
  () => import('@/app/_components/MapView'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-1/2 h-full bg-muted flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading Map...
        </div>
      </div>
    )
  }
);

export default function ForSalePage() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PropertyList 
        properties={saleProperties}
        onPropertySelect={(property) => setSelectedProperty(property)} 
      />
      <MapViewNoSSR 
        properties={saleProperties} 
        selectedProperty={selectedProperty}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
} 