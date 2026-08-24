import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { initLeaflet } from '../lib/leaflet-init';

const capitalCoordinates = {
  'ARACAJU': [-10.9472, -37.0731],
  'BELEM': [-1.4550, -48.5024],
  'BELO HORIZONTE': [-19.9167, -43.9345],
  'BOA VISTA': [2.8235, -60.6758],
  'BRASILIA': [-15.7942, -47.8822],
  'CAMPO GRANDE': [-20.4428, -54.6464],
  'CUIABA': [-15.6014, -56.0979],
  'CURITIBA': [-25.4290, -49.2671],
  'FLORIANOPOLIS': [-27.5954, -48.5480],
  'FORTALEZA': [-3.7172, -38.5434],
  'GOIANIA': [-16.6869, -49.2648],
  'JOAO PESSOA': [-7.1195, -34.8450],
  'MACAPA': [0.0356, -51.0705],
  'MACEIO': [-9.6498, -35.7089],
  'MANAUS': [-3.1190, -60.0217],
  'NATAL': [-5.7945, -35.2110],
  'PALMAS': [-10.2128, -48.3601],
  'PORTO ALEGRE': [-30.0346, -51.2177],
  'PORTO VELHO': [-8.7612, -63.9039],
  'RECIFE': [-8.0476, -34.8770],
  'RIO BRANCO': [-9.9750, -67.8249],
  'RIO DE JANEIRO': [-22.9068, -43.1729],
  'SALVADOR': [-12.9714, -38.5014],
  'SAO LUIS': [-2.5297, -44.3028],
  'SAO PAULO': [-23.5505, -46.6333],
  'TERESINA': [-5.0892, -42.8016],
  'VITORIA': [-20.3155, -40.3128],
};

const Map = ({ data }) => {
  useEffect(() => {
    initLeaflet();
  }, []);

  const center = [-15.7942, -47.8822]; // Center on Brasilia

  return (
    <MapContainer center={center} zoom={4} style={{ height: '600px', width: '100%', borderRadius: '10px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && data.map((capital) => {
        const coords = capitalCoordinates[capital.CAPITAL];
        if (coords) {
          return (
            <Marker key={capital.CAPITAL} position={coords}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{capital.CAPITAL}</h3>
                  <p style={{ margin: 0 }}><strong>Temp:</strong> {capital.TMAX18}</p>
                  <p style={{ margin: 0 }}><strong>Weather:</strong> {capital.RESUMO}</p>
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

export default Map;
