"use client"

import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icons
const fixLeafletIcon = () => {
  // Fix icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div class="pin-marker">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
           </div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Define the doctor type
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  position: [number, number]; // [latitude, longitude]
}

// Define the props type
interface MapProps {
  doctors: Doctor[];
}

export default function MapComponent({ doctors }: MapProps) {
  useEffect(() => {
    fixLeafletIcon();
    
    // Add custom CSS for the marker
    const style = document.createElement('style');
    style.textContent = `
      .pin-marker {
        width: 30px;
        height: 42px;
        color: #f43f5e;
        filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.2));
      }
      .pin-marker:hover {
        color: #e11d48;
        transform: scale(1.1);
        transition: all 0.2s ease;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Calculate the center point based on the average of all doctor positions
  const center = doctors.length > 0 
    ? [
        doctors.reduce((sum, doc) => sum + doc.position[0], 0) / doctors.length,
        doctors.reduce((sum, doc) => sum + doc.position[1], 0) / doctors.length
      ] as [number, number]
    : [19.076, 72.877] as [number, number]; // Default to Mumbai center
  
  return (
    <MapContainer 
      center={center} 
      zoom={11} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {doctors.map((doctor) => (
        <Marker 
          key={doctor.id}
          position={doctor.position}
          icon={createCustomIcon()}
        >
          <Popup>
            <div style={{ padding: '4px 0' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{doctor.name}</h3>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{doctor.specialty}</p>
              <p style={{ fontSize: '12px', marginBottom: '2px' }}>{doctor.address}</p>
              <p style={{ fontSize: '12px', marginBottom: '0' }}>{doctor.phone}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 