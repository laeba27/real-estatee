'use client';
import { useState, useEffect } from 'react';
import PropertyList from '@/app/_components/PropertyList';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabase/client';

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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('listing_type', 'sale')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match your component's expectations
        const transformedProperties = data.map(property => ({
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          address: property.address,
          city: property.city,
          state: property.state,
          images: property.images || [],
          beds: property.bedrooms,
          baths: property.bathrooms,
          size: property.size,
          parking: property.parking,
          homeType: property.property_type,
          isRental: property.listing_type === 'rent',
          location: {
            lat: property.latitude || 20.5937,
            lng: property.longitude || 78.9629
          }
        }));

        setProperties(transformedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] rounded bg-gray-200"></div>
              <div className="h-4 w-[200px] rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error Loading Properties</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PropertyList 
        properties={properties}
        onPropertySelect={setSelectedProperty}
        loading={loading}
      />
      <MapViewNoSSR 
        properties={properties} 
        selectedProperty={selectedProperty}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
} 