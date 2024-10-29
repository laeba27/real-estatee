import { MapPin, Bed, Bath, Home, Car, IndianRupee, Info, Navigation } from 'lucide-react';
import Link from 'next/link';

const Badge = ({ children, color }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
    {children}
  </span>
);

const PropertyCard = ({ property, onLocationClick, distance, onShowRoute, userLocation }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.address}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge color="bg-primary/90 text-white">
            {property.homeType}
          </Badge>
          <Badge color="bg-green-500/90 text-white">
            For Sale
          </Badge>
        </div>
        {distance && (
        <div className="absolute top-2 right-2">
          <Badge color="bg-blue-500/90 text-white">
            {distance} km away
          </Badge>
        </div>
      )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <IndianRupee className="w-5 h-5 text-primary" />
          <h3 className="text-2xl font-semibold text-primary">
            {property.price.toLocaleString()}
          </h3>
        </div>
        
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          <p className="text-muted-foreground text-sm">{property.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-secondary rounded-md">
              <Bed className="w-4 h-4" />
            </div>
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-secondary rounded-md">
              <Bath className="w-4 h-4" />
            </div>
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-secondary rounded-md">
              <Home className="w-4 h-4" />
            </div>
            <span>{property.homeType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-secondary rounded-md">
              <Car className="w-4 h-4" />
            </div>
            <span>{property.parking} Parking</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLocationClick(property);
            }}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            <MapPin size={16} />
            View Location
          </button>

          {userLocation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowRoute(userLocation, property.location);
              }}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Navigation size={16} />
              Show Route
            </button>
          )}

          <Link 
            href={`/properties/${property.id}`}
            className="flex items-center justify-center gap-2 bg-secondary text-primary px-4 py-2.5 rounded-md hover:bg-secondary/90 transition-colors"
          >
            <Info size={16} />
            View Details
          </Link>
        </div>
      </div>

     
    </div>
  );
};

export default PropertyCard; 