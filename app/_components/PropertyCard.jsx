import { MapPin, Bed, Bath, Home, Car, IndianRupee, Info, Navigation, LocateFixed } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Badge = ({ children, color }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
    {children}
  </span>
);

const PropertyCard = ({ property, onPropertySelect, userLocation }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/properties/${property.id}`);
  };

  const handleViewOnMap = (e) => {
    e.preventDefault();
    if (onPropertySelect) {
      onPropertySelect(property);
      if (window.innerWidth < 768) {
        const mapElement = document.querySelector('.map-container');
        mapElement?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleShowRoute = (e) => {
    e.preventDefault();
    if (userLocation && onPropertySelect) {
      onPropertySelect({
        routePoints: {
          start: userLocation,
          end: property.location
        },
        location: property.location
      });
      if (window.innerWidth < 768) {
        const mapElement = document.querySelector('.map-container');
        mapElement?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="relative">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge color="bg-primary/70 text-white">
            {property.isRental ? 'For Rent' : 'For Sale'}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-2">
        <div className='flex items-center gap-1 mb-2'>
        <IndianRupee className="w-4 h-4" />
          <span className="text-xl font-bold">
            {property.isRental 
              ? `${property.price.toLocaleString()}/month`
              : property.price.toLocaleString()}
          </span>
        </div>
         <div>
         {userLocation && (
            <Button
              onClick={handleShowRoute}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-colors"
            >
              <LocateFixed className="w-4 h-4" />
              Get Directions
            </Button>
          )}
         
         </div>
          
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.address}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{property.beds} Bedrooms</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{property.baths} Bathrooms</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Home className="w-4 h-4" />
            <span className="text-sm">{property.homeType}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Car className="w-4 h-4" />
            <span className="text-sm">{property.parking} Parking</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
        <Button 
            onClick={handleViewDetails}
            className=" bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2  transition-colors"
          >
            <Info className="w-4 h-4 " />
            View Details
          </Button>
          <Button
            onClick={handleViewOnMap}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            View on Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;