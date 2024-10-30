'use client';
import { useState } from 'react';
import { MapPin, Bed, Bath, Home, Car, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const MapViewNoSSR = dynamic(
  () => import('@/app/_components/PropertyMapView'),
  { ssr: false }
);

// Import both property lists
const saleProperties = [
  // ... your sale properties data
];

const rentProperties = [
  // ... your rent properties data
];

export default function PropertyDetail({ params }) {
  // Combine both property lists and find the requested property
  const allProperties = [...saleProperties, ...rentProperties];
  const property = allProperties.find(p => p.id === parseInt(params.id));

  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  if (!property) {
    return <div>Property not found</div>;
  }

  const nextImage = () => {
    setLoading(true);
    setActiveImage((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setLoading(true);
    setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery Section - remains the same */}
      
      {/* Property Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{property.address}</h1>
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
                <span>{property.homeType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-muted-foreground" />
                <span>{property.parking} Parking</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About this property</h2>
                <p className="text-muted-foreground">
                  This beautiful {property.homeType.toLowerCase()} is available for 
                  {property.isRental ? ' rent' : ' sale'} in a prime location. 
                  It features {property.beds} bedrooms and {property.baths} bathrooms, 
                  making it perfect for {property.beds > 2 ? 'families' : 'couples'}. 
                  {property.parking > 0 && ` Comes with ${property.parking} dedicated parking ${property.parking > 1 ? 'spaces' : 'space'}.`}
                </p>
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
                  <span>{property.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h3 className="text-xl font-semibold mb-4">
              Contact {property.isRental ? 'Owner' : 'Agent'}
            </h3>
            <form className="space-y-4">
              {/* ... form fields remain the same ... */}
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