'use client';
import { useEffect, useState } from 'react';
import { MapPin, Bed, Bath, Home, Car, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabase/client';

const MapViewNoSSR = dynamic(
  () => import('@/app/_components/PropertyMapView'),
  { ssr: false }
);

export default function PropertyDetail({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const propertyId = params.id;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) throw error;

        const transformedProperty = {
          ...data,
          location: {
            lat: data.latitude || 20.5937,
            lng: data.longitude || 78.9629
          },
          beds: data.bedrooms,
          baths: data.bathrooms,
          homeType: data.property_type,
          isRental: data.listing_type === 'rent',
          owner: {
            full_name: "Property Owner",
            email: "Contact through website",
            phone: null
          }
        };

        setProperty(transformedProperty);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-52"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery */}
      <div className="relative h-[50vh] bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[activeImage]}
              alt={`Property image ${activeImage + 1}`}
              fill
              className="object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeImage ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No images available</p>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            <div className="flex items-center gap-2 text-2xl mb-6">
              <IndianRupee className="w-6 h-6" />
              <span className="font-semibold">
                {property.price.toLocaleString()}
                {property.isRental && <span className="text-base ml-1">/month</span>}
              </span>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-muted-foreground" />
                <span>{property.property_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-muted-foreground" />
                <span>{property.parking} Parking</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </div>

              {/* Map Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Location</h2>
                <div className="h-[400px] rounded-lg overflow-hidden border">
                  <MapViewNoSSR
                    center={property.location}
                    zoom={15}
                    properties={[property]}
                    selectedProperty={property}
                  />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h3 className="text-xl font-semibold mb-4">Contact Property Owner</h3>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Interested in this property? Send an inquiry to get more information.
              </p>
            </div>
            <form className="space-y-4">
              <Button className="w-full">
                Send {property.isRental ? 'Rental' : 'Purchase'} Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
