'use client';
import { useState } from 'react';
import { MapPin, Bed, Bath, Home, Car, IndianRupee, Phone, Mail, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import MapView
const MapViewNoSSR = dynamic(
  () => import('@/app/_components/PropertyMapView'),
  { ssr: false }
);

// Mock additional images (in production, these would come from your database)
const additionalImages = [
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
];

export default function PropertyDetail({ params }) {
  const [activeImage, setActiveImage] = useState(0);


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
  
  // In production, fetch this data from your API/database
  const property = properties.find(p => p.id === parseInt(params.id));

  if (!property) return <div>Property not found</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 py-8 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4">{property.address}</h1>
              <div className="flex items-center gap-2 text-2xl mb-4">
                <IndianRupee className="w-6 h-6" />
                <span className="font-semibold">{property.price.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Bed /> {property.beds} Beds
                </div>
                <div className="flex items-center gap-2">
                  <Bath /> {property.baths} Baths
                </div>
                <div className="flex items-center gap-2">
                  <Home /> {property.homeType}
                </div>
                <div className="flex items-center gap-2">
                  <Car /> {property.parking} Parking
                </div>
              </div>
            </div>
            
            {/* Image Gallery */}
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src={additionalImages[activeImage]}
                alt={property.address}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      idx === activeImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
              <p className="text-muted-foreground">
                This beautiful {property.homeType.toLowerCase()} features {property.beds} bedrooms and {property.baths} bathrooms,
                making it perfect for families or professionals. Located in a prime area of {property.address.split(',')[1]},
                this property offers both comfort and convenience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <span>Modern Design</span>
                </div>
                {/* Add more features */}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapViewNoSSR 
                  properties={[property]}
                  selectedProperty={property}
                  singleProperty
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" />
                  <span>agent@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary" />
                  <span>Schedule a Visit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 