import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import './MapComponent.css';

// Define custom icons for vehicles
const vehicleIcon = new L.Icon({
  iconUrl: '/images/car.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

function MapComponent({ vehicleData = [] }) {
  if (!vehicleData || vehicleData.length === 0) {
    return <div>No vehicles data available</div>;
  }

  // Calculate the average latitude and longitude to center the map
  const center = [
    vehicleData.reduce((acc, vehicle) => acc + vehicle.lat, 0) / vehicleData.length,
    vehicleData.reduce((acc, vehicle) => acc + vehicle.lng, 0) / vehicleData.length,
  ];

  // Define a zoom level based on the number of vehicles (for simplicity, using a constant here)
  const zoomLevel = vehicleData.length > 1 ? 10 : 13;

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={zoomLevel} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Display markers with custom icons */}
        {vehicleData.map((vehicle, index) => (
          <Marker
            key={index}
            position={[vehicle.lat, vehicle.lng]}
            icon={vehicleIcon}
            rotationAngle={vehicle.heading || 0} // Rotate the marker based on the heading
          >
            <Popup>
              <strong>{vehicle.name}</strong>
              <br />
              Status: {vehicle.status}
              <br />
              Last Updated: {vehicle.lastUpdated}
              <br />
              Speed: {vehicle.speed} km/h
              <br />
              Heading: {vehicle.heading}°
            </Popup>
          </Marker>
        ))}

        {/* Zoom controls (optional) */}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
