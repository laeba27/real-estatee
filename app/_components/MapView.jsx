'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Only import Leaflet CSS if we're on the client side
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
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

// Component to handle map updates
function MapUpdater({ selectedProperty }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.location.lat, selectedProperty.location.lng],
        16,
        {
          animate: true,
          duration: 1
        }
      );
    }
  }, [selectedProperty, map]);

  return null;
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
        <h3 className="font-semibold text-lg">Rs. {property.price.toLocaleString()}</h3>
        <p className="text-sm text-gray-600">{property.address}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>🛏️ {property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚿 {property.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏠 {property.homeType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚗 {property.parking} parking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapView = ({ properties, selectedProperty }) => {
  const defaultCenter = [20.5937, 78.9629]; // Center of India
  
  return (
    <div className="w-1/2 h-full sticky top-0">
      <MapContainer 
        center={defaultCenter}
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapUpdater selectedProperty={selectedProperty} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
};

export default MapView;