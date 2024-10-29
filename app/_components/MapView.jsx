'use client';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Search, MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
  require('leaflet-routing-machine/dist/leaflet-routing-machine.css');
}

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Add a custom icon for user location
const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function RouteLayer({ start, end, map }) {
  const routeRef = useRef(null);

  useEffect(() => {
    if (!start || !end || !map) return;

    // Clear existing route
    if (routeRef.current) {
      routeRef.current.remove();
    }

    // Create polyline for route
    const routeLine = L.polyline([], {
      color: '#6366f1',
      weight: 6,
      opacity: 0.8
    }).addTo(map);

    routeRef.current = routeLine;

    // Calculate route using OSRM
    fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`)
      .then(response => response.json())
      .then(data => {
        if (data.code === 'Ok' && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          routeLine.setLatLngs(coordinates);
          
          // Fit map to show route
          map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

          // Add route info
          const distance = (data.routes[0].distance / 1000).toFixed(1);
          const duration = Math.round(data.routes[0].duration / 60);

          const routeInfo = L.control({ position: 'topright' });
          routeInfo.onAdd = function() {
            const div = L.DomUtil.create('div', 'route-info');
            div.innerHTML = `
              <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="font-semibold mb-2">Route Information</h3>
                <p>Distance: ${distance} km</p>
                <p>Duration: ${duration} minutes</p>
              </div>
            `;
            return div;
          };
          routeInfo.addTo(map);
        }
      })
      .catch(error => {
        console.error('Error calculating route:', error);
      });

    return () => {
      if (routeRef.current) {
        routeRef.current.remove();
      }
    };
  }, [start, end, map]);

  return null;
}

function MapUpdater({ selectedProperty, routePoints }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty && !routePoints) {
      map.setView(
        [selectedProperty.location.lat, selectedProperty.location.lng],
        16,
        { animate: true, duration: 1 }
      );
    }
  }, [selectedProperty, routePoints, map]);

  return routePoints?.start && routePoints?.end ? (
    <RouteLayer 
      start={routePoints.start} 
      end={routePoints.end}
      map={map}
    />
  ) : null;
}

const PropertyPopup = ({ property }) => {
  return (
    <div className="property-popup" style={{ minWidth: "200px" }}>
      <img 
        src={property.image} 
        alt={property.address}
        className="w-full h-32 object-cover rounded-t-md"
      />
      <div className="p-3">
        <h3 className="font-semibold text-lg">₹{property.price.toLocaleString()}</h3>
        <p className="text-sm text-gray-600">{property.address}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>🛏️ {property.beds} beds</div>
          <div>🚿 {property.baths} baths</div>
          <div>🏠 {property.homeType}</div>
          <div>🚗 {property.parking} parking</div>
        </div>
      </div>
    </div>
  );
};

// Search Component
function SearchControl() {
  const map = useMap();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const results = await response.json();
      setSearchResults(results);
      
      if (results.length > 0) {
        const { lat, lon } = results[0];
        map.setView([lat, lon], 16);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-80">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location..."
          className="w-full px-4 py-2 pl-10 rounded-lg border shadow-sm focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-md text-sm"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {isLoading && (
        <div className="mt-2 p-2 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}

      {!isLoading && searchResults.length === 0 && searchQuery && (
        <div className="mt-2 p-2 text-center text-sm text-gray-500">
          No results found
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
          {searchResults.map((result, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 text-sm"
              onClick={() => {
                map.setView([result.lat, result.lon], 16);
                setSearchResults([]);
                setSearchQuery(result.display_name);
              }}
            >
              <div className="font-medium">{result.display_name}</div>
              <div className="text-xs text-gray-500">
                Lat: {Number(result.lat).toFixed(6)}, Lon: {Number(result.lon).toFixed(6)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Draggable Marker Component
function DraggableMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const markerRef = useRef(null);

  const enableMarkerPlacement = () => {
    map.once('click', (e) => {
      setPosition(e.latlng);
    });
  };

  useEffect(() => {
    if (position && markerRef.current) {
      const marker = markerRef.current;
      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setPosition(newPos);
        onLocationSelect?.(newPos);
      });
    }
  }, [position, onLocationSelect]);

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={enableMarkerPlacement}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-primary/90"
        >
          <MapPin className="w-4 h-4" />
          Mark Location
        </button>
      </div>

      {position && (
        <Marker
          ref={markerRef}
          position={position}
          draggable={true}
          icon={icon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Selected Location</p>
              <p>Latitude: {position.lat.toFixed(6)}</p>
              <p>Longitude: {position.lng.toFixed(6)}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

const MapView = ({ properties, selectedProperty, onLocationSelect }) => {
  return (
    <div className="w-1/2 h-full sticky top-0">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <SearchControl />
        <DraggableMarker onLocationSelect={onLocationSelect} />
        <MapUpdater 
          selectedProperty={selectedProperty} 
          routePoints={selectedProperty?.routePoints}
        />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Show user location if available */}
        {selectedProperty?.isUser && (
          <Marker 
            position={[selectedProperty.location.lat, selectedProperty.location.lng]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-sm font-medium">Your Location</div>
            </Popup>
          </Marker>
        )}
        
        {/* Show property markers */}
        {properties.map((property) => (
          <Marker 
            key={property.id}
            position={[property.location.lat, property.location.lng]}
            icon={icon}
          >
            <Popup>
              <PropertyPopup property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;