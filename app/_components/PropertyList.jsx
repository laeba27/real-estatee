'use client';
import { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Bed, Bath, Home, Car, Navigation, X, IndianRupee} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Dummy properties data


const PropertyList = ({ properties, onPropertySelect }) => {


    
  const [filters, setFilters] = useState({
    search: '',
    beds: '',
    baths: '',
    homeType: '',
    parking: '',
    priceRange: '',
    nearbyRadius: '',
  });

  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Function to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Function to get user's location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
          // Notify parent component about user location
          onPropertySelect({ location: { lat: latitude, lng: longitude }, isUser: true });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert("Unable to get your location. Please check your browser settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
    }
  };

  // Helper function to check if price is within range
  const isPriceInRange = (price, range) => {
    if (!range) return true;
    const [min, max] = range.split('-').map(Number);
    if (max) {
      return price >= min && price <= max;
    }
    return price >= min; // For "above X" ranges
  };

  // Filter properties based on all filters including radius
  const filteredProperties = properties.filter(property => {
    // Basic filters
    const basicFilters = (
      (!filters.search || 
        property.address.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.beds || property.beds >= parseInt(filters.beds)) &&
      (!filters.baths || property.baths >= parseInt(filters.baths)) &&
      (!filters.homeType || property.homeType === filters.homeType) &&
      (!filters.parking || property.parking >= parseInt(filters.parking))
    );

    // Price filter
    let priceFilter = true;
    if (filters.priceRange) {
      if (filters.priceRange.includes('-')) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        priceFilter = property.price >= min && property.price <= max;
      } else if (filters.priceRange.includes('+')) {
        const min = parseInt(filters.priceRange);
        priceFilter = property.price >= min;
      }
    }

    // Radius filter
    let radiusFilter = true;
    if (userLocation && filters.nearbyRadius) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        property.location.lat,
        property.location.lng
      );
      radiusFilter = distance <= parseInt(filters.nearbyRadius);
    }

    return basicFilters && priceFilter && radiusFilter;
  });

  const handleShowRoute = (start, end) => {
    onPropertySelect({ 
      routePoints: { start, end },
      location: end
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      beds: '',
      baths: '',
      homeType: '',
      parking: '',
      priceRange: '',
      nearbyRadius: '',
    });
  };

  // Determine if we're showing rental properties
  const isRental = properties.some(property => property.isRental);

  // Price range options based on property type
  const priceRangeOptions = isRental ? [
    { label: 'Under ₹15,000', value: '0-15000' },
    { label: '₹15,000 - ₹25,000', value: '15000-25000' },
    { label: '₹25,000 - ₹35,000', value: '25000-35000' },
    { label: '35000+', value: '35000-999999999' }  // Using a high number for "Above" filter
  ] : [
    { label: 'Under ₹50L', value: '0-5000000' },
    { label: '₹50L - ₹1Cr', value: '5000000-10000000' },
    { label: '₹1Cr - ₹2Cr', value: '10000000-20000000' },
    { label: 'Above ₹2Cr', value: '20000000-999999999' }
  ];

  return (
    <div className="w-1/2 h-full overflow-y-auto bg-background ">
      {/* Search and Filters */}
      <div className="bg-background sticky top-0 z-10  p-4 space-y-4">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search location..."
            className="w-full pl-10 p-3 border rounded-lg bg-background"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={getUserLocation}
            disabled={isLoadingLocation}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
          </button>
          
          <select
            className="flex-1 p-2 border rounded-lg bg-background"
            onChange={(e) => setFilters({ ...filters, nearbyRadius: e.target.value })}
            disabled={!userLocation}
          >
            <option value="">Search Radius</option>
            <option value="50">Within 50 km</option>
            <option value="100">Within 100 km</option>
            <option value="150">Within 150 km</option>
            <option value="200">Within 200 km</option>
            <option value="250">Within 250 km</option>
          </select>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2 p-3 border rounded-lg bg-background">
              <Bed className="text-muted-foreground" />
              <span className="flex-1 text-sm text-left">{filters.beds || 'Beds'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Bedrooms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ ...filters, beds: '2' })}>2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, beds: '3' })}>3</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, beds: '4' })}>4+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2 p-3 border rounded-lg bg-background">
              <Bath className="text-muted-foreground" />
              <span className="flex-1 text-sm text-left">{filters.baths || 'Baths'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Bathrooms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ ...filters, baths: '1' })}>1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, baths: '2' })}>2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, baths: '3' })}>3+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2 p-3 border rounded-lg bg-background">
              <Home className="text-muted-foreground" />
              <span className="flex-1 text-sm text-left">{filters.homeType || 'Type'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Home Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ ...filters, homeType: 'House' })}>House</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, homeType: 'Apartment' })}>Apartment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, homeType: 'Villa' })}>Villa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2 p-3 border rounded-lg bg-background">
              <Car className="text-muted-foreground" />
              <span className="flex-1 text-sm text-left">{filters.parking || 'Parking'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Parking Spaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ ...filters, parking: '1' })}>1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, parking: '2' })}>2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, parking: '3' })}>3+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2 p-3 border rounded-lg bg-background">
              <IndianRupee className="text-muted-foreground" />
              <span className="flex-1 text-sm text-left">
                {filters.priceRange ? 
                  priceRangeOptions.find(opt => opt.value === filters.priceRange)?.label || 'Price' 
                  : 'Price'}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{isRental ? 'Monthly Rent' : 'Price Range'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priceRangeOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setFilters({ ...filters, priceRange: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {Object.values(filters).some(Boolean) && (
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="mt-4 w-full flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Property Cards */}
      <div className="space-y-4 mt-4 p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onPropertySelect={onPropertySelect}
              userLocation={userLocation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyList; 