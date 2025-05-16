import { useEffect, useState } from 'react';

async function fetchLocationName(lat, lon) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Erreur récupération lieu');
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || data.address.county || "Lieu inconnu";
  } catch {
    return "Lieu inconnu";
  }
}

export default function AirQuality() {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState(null);
  const [quality, setQuality] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "https://q2ntad65mi.execute-api.ca-central-1.amazonaws.com/Prod/airquality";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('⚠️ Géolocalisation non supportée.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setCoords({ lat, lon });

        const locationName = await fetchLocationName(lat, lon);
        setLocation(locationName);

        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          });
          const data = await response.json();
          if (response.ok) setQuality(data);
          else setError(data.message || "Erreur API");
        } catch (err) {
          setError("Erreur réseau : " + err.message);
        }
      },
      (err) => {
        setError(`❌ Erreur de géolocalisation : ${err.message}`);
      }
    );
  }, []);

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🌬️ AirCare</h2>
      {error && <p style={styles.error}>{error}</p>}

      {location ? (
        <p>📍 Lieu : {location}</p>
      ) : coords ? (
        <p>📍 Latitude : {coords.lat} <br />📍 Longitude : {coords.lon}</p>
      ) : null}

      {quality && (
        <div style={styles.result}>
          <h3>Qualité de l’air : {quality.niveau}</h3>
          <p>AQI : {quality.aqi}</p>
        </div>
      )}

      {!quality && !error && <p style={styles.loading}>⏳ Récupération des données...</p>}
    </div>
  );
}

const styles = {
  card: {
    background: '#f9f9f9',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '2rem auto',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  result: {
    background: '#e0ffe0',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
  },
  loading: {
    color: '#777',
    fontStyle: 'italic',
  }
};

