'use client';
import { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Bed, Bath, Home, Car } from 'lucide-react';

// Dummy properties data


const PropertyList = ({ properties, onPropertySelect }) => {


    
  const [filters, setFilters] = useState({
    search: '',
    beds: '',
    baths: '',
    homeType: '',
    parking: ''
  });

  // Filter properties based on selected filters
  const filteredProperties = properties.filter(property => {
    return (
      (!filters.search || 
        property.address.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.beds || property.beds >= parseInt(filters.beds)) &&
      (!filters.baths || property.baths >= parseInt(filters.baths)) &&
      (!filters.homeType || property.homeType === filters.homeType) &&
      (!filters.parking || property.parking >= parseInt(filters.parking))
    );
  });

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
        
        <div className="grid grid-cols-2 gap-4">
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList; 