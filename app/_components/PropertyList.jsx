'use client';
import { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Bed, Bath, Home, Car, Navigation } from 'lucide-react';

// Dummy properties data


const PropertyList = ({ properties, onPropertySelect }) => {


    
  const [filters, setFilters] = useState({
    search: '',
    beds: '',
    baths: '',
    homeType: '',
    parking: '',
    nearbyRadius: '',
  });

  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Function to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

  // Filter properties based on all filters including nearby
  const filteredProperties = properties.filter(property => {
    const matchesBasicFilters = (
      (!filters.search || 
        property.address.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.beds || property.beds >= parseInt(filters.beds)) &&
      (!filters.baths || property.baths >= parseInt(filters.baths)) &&
      (!filters.homeType || property.homeType === filters.homeType) &&
      (!filters.parking || property.parking >= parseInt(filters.parking))
    );

    // Check nearby filter if user location is available
    if (userLocation && filters.nearbyRadius) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        property.location.lat,
        property.location.lng
      );
      return matchesBasicFilters && distance <= parseInt(filters.nearbyRadius);
    }

    return matchesBasicFilters;
  });

  const handleShowRoute = (start, end) => {
    onPropertySelect({ 
      routePoints: { start, end },
      location: end
    });
  };

  return (
    <div className="w-1/2 h-full overflow-y-auto bg-background p-4">
      {/* Search and Filters */}
      <div className="bg-background sticky top-0 z-10 pb-4 space-y-4">
        <div className="relative">
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
        
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select 
              className="w-full pl-10 p-3 border rounded-lg bg-background appearance-none"
              onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
            >
              <option value="">Bedrooms</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="relative">
            <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select 
              className="w-full pl-10 p-3 border rounded-lg bg-background appearance-none"
              onChange={(e) => setFilters({ ...filters, baths: e.target.value })}
            >
              <option value="">Bathrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select 
              className="w-full pl-10 p-3 border rounded-lg bg-background appearance-none"
              onChange={(e) => setFilters({ ...filters, homeType: e.target.value })}
            >
              <option value="">Home Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </div>

          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select 
              className="w-full pl-10 p-3 border rounded-lg bg-background appearance-none"
              onChange={(e) => setFilters({ ...filters, parking: e.target.value })}
            >
              <option value="">Parking Spaces</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Cards */}
      <div className="space-y-4 mt-4">
        {filteredProperties.map((property) => (
          <div key={property.id}>
            <PropertyCard 
              property={property} 
              onLocationClick={onPropertySelect}
              onShowRoute={handleShowRoute}
              userLocation={userLocation}
              distance={
                userLocation
                  ? calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      property.location.lat,
                      property.location.lng
                    ).toFixed(1)
                  : null
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList; 