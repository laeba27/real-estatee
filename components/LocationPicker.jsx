"use client";
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function DraggableMarker({ position, onPositionChange }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange(newPos);
      }
    },
  };

  if (!position) return null;

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={new Icon({
        iconUrl: '/marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    />
  );
}

export default function LocationPicker({ address, city, onLocationSelect, currentLocation }) {
  const [position, setPosition] = useState(currentLocation || null);
  const [searchError, setSearchError] = useState(null);

  const searchAddress = async (searchText) => {
    if (!searchText) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        const newPos = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setPosition(newPos);
        onLocationSelect(newPos);
      } else {
        setSearchError('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchError('Error searching location');
    }
  };

  const debouncedSearch = debounce(searchAddress, 1000);

  useEffect(() => {
    if (address && city) {
      debouncedSearch(`${address}, ${city}`);
    }
  }, [address, city]);

  const handleMarkerDrag = (newPos) => {
    setPosition(newPos);
    onLocationSelect(newPos);
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={position || [20.5937, 78.9629]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onPositionChange={handleMarkerDrag} />
      </MapContainer>
      {searchError && (
        <p className="text-sm text-red-500 mt-2">{searchError}</p>
      )}
    </div>
  );
} 