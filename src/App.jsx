import React from 'react';

export default function App() {
  return (
    <div className="card">
      <h1>Bienvenue sur AirCare</h1>
      <p>Qualité de l’air en temps réel pour les utilisateurs asthmatiques</p>
      <div>📍 Downtown Toronto</div>
      <div className="metrics">
        <div className="metric">
          <span className="icon">⚠️</span>
          <span className="value">42</span>
          <span className="label">Indice AQI</span>
        </div>
        <div className="metric">
          <span className="icon">💨</span>
          <span className="value">12 μg/m³</span>
          <span className="label">PM2.5</span>
        </div>
      </div>
    </div>
  );
}
