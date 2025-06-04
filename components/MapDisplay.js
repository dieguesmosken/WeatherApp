import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet to fix marker icon issue
import { useI18n } from '../lib/i18n/i18nContext';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapDisplay = ({ latitude, longitude, zoom }) => {
  const { t } = useI18n();

  if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
    return <p>Loading map...</p>; // Consider translating this too if it's user-visible for long
  }

  const position = [latitude, longitude];

  return (
    <div>
      <h2>{t('mapTitle')}</h2>
      <MapContainer center={position} zoom={zoom || 13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  );
};

export default MapDisplay;
