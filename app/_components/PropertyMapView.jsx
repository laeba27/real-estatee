'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapUpdater({ selectedProperty }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.location.lat, selectedProperty.location.lng],
        16,
        { animate: true, duration: 1 }
      );
    }
  }, [selectedProperty, map]);

  return null;
}

const PropertyMapView = ({ properties, selectedProperty, singleProperty = false }) => {
  return (
    <MapContainer 
      center={[selectedProperty?.location.lat || 20.5937, selectedProperty?.location.lng || 78.9629]}
      zoom={singleProperty ? 16 : 5}
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
            <div className="text-sm">
              <p className="font-semibold">₹{property.price.toLocaleString()}</p>
              <p>{property.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PropertyMapView; 