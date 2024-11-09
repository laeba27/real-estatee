"use client";
import { useState, useEffect, Suspense } from 'react';
import PropertyList from '@/app/_components/PropertyList';
import dynamic from 'next/dynamic';
import { supabase } from "@/utils/supabase/client"; // Ensure you have this import

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

export default function RentPage() {
  const [rentProperties, setRentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('listing_type', 'rent'); // Fetch properties where listing_type is rent

        if (error) {
          throw new Error(error.message);
        }

        // Format the data to match the structure expected by PropertyList and MapView
        const formattedProperties = data.map(property => ({
          id: property.id,
          images: property.images, // Assuming images is a string array in your DB
          price: property.price,
          address: property.address,
          beds: property.bedrooms,
          baths: property.bathrooms,
          homeType: property.property_type,
          parking: property.parking,
          location: {
            lat: property.latitude,
            lng: property.longitude,
          },
          isRental: property.listing_type === 'rent',
        }));

        setRentProperties(formattedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

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
