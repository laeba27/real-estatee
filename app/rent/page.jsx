"use client";
import { useState, Suspense } from 'react';
import PropertyList from '@/app/_components/PropertyList';
import dynamic from 'next/dynamic';

// Dynamically import MapView with no SSR and proper loading state
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

const rentProperties = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e03c0cdc276?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687644-aac76f0e23ec?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687666-146f0e44c518?w=800&q=80"
      ],
      price: 25000,
      address: "123 MG Road, Bengaluru, Karnataka",
      beds: 3,
      baths: 2,
      homeType: "House",
      parking: 1,
      location: { lat: 12.9716, lng: 77.5946 },
      isRental: true
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-444d48c3b665?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154284-4e5539983546?w=800&q=80"
      ],
      price: 35000,
      address: "456 Malabar Hill, Mumbai, Maharashtra",
      beds: 2,
      baths: 2,
      homeType: "Apartment",
      parking: 1,
      location: { lat: 19.2288, lng: 72.8372 },
      isRental: true
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      price: 45000,
      address: "789 Golf Course Road, Gurugram, Haryana",
      beds: 4,
      baths: 3,
      homeType: "Villa",
      parking: 2,
      location: { lat: 28.4595, lng: 77.0266 },
      isRental: true
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      price: 30000,
      address: "321 Anna Nagar, Chennai, Tamil Nadu",
      beds: 3,
      baths: 2.5,
      homeType: "House",
      parking: 1,
      location: { lat: 13.0827, lng: 80.2707 },
      isRental: true
    }
];

export default function RentPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
    // You can use this location data when adding new properties
    // location.lat and location.lng will give you the coordinates
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PropertyList 
        properties={rentProperties}
        onPropertySelect={(property) => setSelectedProperty(property)} 
      />
      <MapViewNoSSR 
        properties={rentProperties} 
        selectedProperty={selectedProperty}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}