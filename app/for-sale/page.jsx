'use client';
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

const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      price: 6500000,
      address: "123 MG Road, Bengaluru, Karnataka",
      beds: 3,
      baths: 2,
      homeType: "House",
      parking: 1,
      location: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      price: 8500000,
      address: "456 Malabar Hill, Mumbai, Maharashtra",
      beds: 2,
      baths: 2,
      homeType: "Apartment",
      parking: 1,
      location: { lat: 19.2288, lng: 72.8372 }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      price: 12500000,
      address: "789 Golf Course Road, Gurugram, Haryana",
      beds: 4,
      baths: 3,
      homeType: "Villa",
      parking: 2,
      location: { lat: 28.4595, lng: 77.0266 }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      price: 9200000,
      address: "321 Anna Nagar, Chennai, Tamil Nadu",
      beds: 3,
      baths: 2.5,
      homeType: "House",
      parking: 1,
      location: { lat: 13.0827, lng: 80.2707 }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      price: 4500000,
      address: "159 Salt Lake, Kolkata, West Bengal",
      beds: 2,
      baths: 1,
      homeType: "Apartment",
      parking: 1,
      location: { lat: 22.5726, lng: 88.3639 }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      price: 15000000,
      address: "753 Banjara Hills, Hyderabad, Telangana",
      beds: 4,
      baths: 3.5,
      homeType: "Villa",
      parking: 2,
      location: { lat: 17.3850, lng: 78.4867 }
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      price: 8000000,
      address: "951 Shastri Nagar, Jaipur, Rajasthan",
      beds: 3,
      baths: 2,
      homeType: "House",
      parking: 1,
      location: { lat: 26.9124, lng: 75.7873 }
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      price: 6000000,
      address: "357 Lajpat Nagar, Delhi",
      beds: 2,
      baths: 1,
      homeType: "Apartment",
      parking: 1,
      location: { lat: 28.6139, lng: 77.2090 }
    }
];


export default function ForSalePage() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PropertyList 
        properties={properties}
        onPropertySelect={(property) => setSelectedProperty(property)} 
      />
      <Suspense fallback={
        <div className="w-1/2 h-full bg-muted flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading Map...
          </div>
        </div>
      }>
        <MapViewNoSSR 
          properties={properties} 
          selectedProperty={selectedProperty}
        />
      </Suspense>
    </div>
  );
} 