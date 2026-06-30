import React, { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet marker icon issue in React build systems
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const LocationPicker = ({ defaultLocation = { lat: 12.9716, lng: 77.5946 }, onLocationChange }) => {
  const [position, setPosition] = useState(defaultLocation);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          const newPos = { lat: latLng.lat, lng: latLng.lng };
          setPosition(newPos);
          if (onLocationChange) onLocationChange(newPos);
        }
      },
    }),
    [onLocationChange],
  );

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border border-slate-300 flex flex-col shadow-inner">
      <div className="flex-1">
        <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[position.lat, position.lng]}
            ref={markerRef}
          >
            <Popup minWidth={90}>
              <span className="text-xs font-bold text-slate-700">Drag to adjust exact location</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="bg-slate-50 p-2 text-[10px] text-slate-500 font-mono flex justify-between border-t border-slate-300">
        <span>Drag the pin to refine coordinates</span>
        <span className="font-bold text-[#059669]">LAT: {position.lat.toFixed(4)} | LNG: {position.lng.toFixed(4)}</span>
      </div>
    </div>
  );
};
