import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Flight } from '../types';
import { PlaneIcon } from './icons';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const createFlightIcon = (flight: Flight, isSelected: boolean) => {
  const rotation = flight.true_track ?? 0;
  const color = isSelected ? '#06b6d4' : '#ffffff'; // cyan-400 for selected, white otherwise
  const scale = isSelected ? 'scale(1.5)' : 'scale(1)';
  const zIndex = isSelected ? 1000 : 500;
  const filter = isSelected ? `drop-shadow(0 0 8px ${color})` : 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.5))';

  const iconHtml = `
    <div style="transform: rotate(${rotation}deg) ${scale}; transition: all 0.3s ease; z-index: ${zIndex}; filter: ${filter};">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-6 h-6">
        <path d="M21.43,11.23,13,3.78a1.5,1.5,0,0,0-2.06,0L2.57,11.23a1,1,0,0,0,.57,1.77H8.5L6,17.45v1.75a1,1,0,0,0,1.6.8L12,17.22l4.4,2.78a1,1,0,0,0,1.6-.8V17.45L15.5,13h5.36a1,1,0,0,0,.57-1.77Z"/>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'leaflet-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapUpdaterProps {
  selectedFlight: Flight | null;
  isSidebarOpen: boolean;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ selectedFlight, isSidebarOpen }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedFlight && selectedFlight.latitude && selectedFlight.longitude) {
      map.flyTo([selectedFlight.latitude, selectedFlight.longitude], map.getZoom(), {
          animate: true,
          duration: 1
      });
    }
  }, [selectedFlight, map]);

  useEffect(() => {
    // Wait for the sidebar transition to finish before invalidating the map size.
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 310); // Sidebar animation is 300ms, wait a fraction longer.

    return () => clearTimeout(timer);
  }, [isSidebarOpen, map]);


  return null;
}

interface MapComponentProps {
  flights: Flight[];
  selectedFlight: Flight | null;
  onSelectFlight: (flight: Flight) => void;
  isSidebarOpen: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ flights, selectedFlight, onSelectFlight, isSidebarOpen }) => {
  return (
    <MapContainer center={[47, 2]} zoom={5} scrollWheelZoom={true} className="h-full w-full z-10">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapUpdater selectedFlight={selectedFlight} isSidebarOpen={isSidebarOpen}/>
      {flights.map((flight) => {
        if (flight.latitude && flight.longitude) {
          return (
            <Marker
              key={flight.icao24}
              position={[flight.latitude, flight.longitude]}
              icon={createFlightIcon(flight, selectedFlight?.icao24 === flight.icao24)}
              eventHandlers={{ click: () => onSelectFlight(flight) }}
            >
              <Popup>
                <div className="font-sans text-sm text-gray-800 space-y-1">
                  <strong className="text-base block">{flight.callsign || 'Unknown'}</strong>
                  <p><strong>Origin:</strong> {flight.origin_country}</p>
                  <p><strong>Baro Altitude:</strong> {flight.baro_altitude ? `${flight.baro_altitude} m` : 'N/A'}</p>
                  <p><strong>Geo Altitude:</strong> {flight.geo_altitude ? `${flight.geo_altitude} m` : 'N/A'}</p>
                  <p><strong>Speed:</strong> {flight.velocity ? `${Math.round(flight.velocity * 3.6)} km/h` : 'N/A'}</p>
                  <p><strong>Vertical Speed:</strong> {flight.vertical_rate ? `${flight.vertical_rate.toFixed(2)} m/s` : 'N/A'}</p>
                  <p><strong>On Ground:</strong> {flight.on_ground ? 'Yes' : 'No'}</p>
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default MapComponent;