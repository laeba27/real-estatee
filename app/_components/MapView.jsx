'use client';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Custom icons
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper Components
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

function PropertyPopup({ property }) {
  return (
    <div className="property-popup" style={{ minWidth: "200px" }}>
      <img 
        src={property.images?.[0]} 
        alt={property.address}
        className="w-full h-32 object-cover rounded-t-md"
      />
      <div className="p-3">
        <h3 className="font-semibold text-lg">₹{property.price?.toLocaleString()}</h3>
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
}

// Main MapView Component
export default function MapView({ properties, selectedProperty, onLocationSelect }) {
  return (
    <div className="w-1/2 h-full sticky top-0 map-container">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater 
          selectedProperty={selectedProperty} 
          routePoints={selectedProperty?.routePoints}
        />

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
}