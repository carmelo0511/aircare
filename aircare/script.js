document.addEventListener('DOMContentLoaded', () => {
  const getAirQualityBtn = document.getElementById('getAirQuality');
  const citySelector     = document.getElementById('citySelector');
  const resultDiv        = document.getElementById('result');
  const loader           = document.getElementById('loader');

  // Ne jamais POST sur le serveur statique local !  
  // En local (localhost ou 127.0.0.1) → on pointe directement l'API Gateway
  // En prod              → on appelle la route relative "/air" qui passera par CloudFront
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const endpoint = isLocal
    ? 'https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air'
    : '/air';

  async function fetchAirQuality(data) {
    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const json = await res.json();
      const { city, aqi, category, advice } = json.data ?? {};
      if (!city) throw new Error('Données manquantes');

      resultDiv.innerHTML = `
        <p class="font-bold text-xl mb-2">${city}</p>
        <p>Indice AQI : <span class="font-semibold">${aqi}</span></p>
        <p>Qualité de l'air : <span class="font-semibold">${category}</span></p>
        <p class="mt-2 italic text-gray-700">${advice}</p>
      `;
    } catch (err) {
      resultDiv.innerHTML = `<p class="text-red-600">Erreur : ${err.message}</p>`;
    } finally {
      loader.classList.add('hidden');
    }
  }

  if (getAirQualityBtn) {
    getAirQualityBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => fetchAirQuality({ latitude: coords.latitude, longitude: coords.longitude }),
          () => resultDiv.innerHTML = `<p class="text-red-600">Géoloc échouée.</p>`
        );
      } else {
        resultDiv.innerHTML = `<p class="text-red-600">Géolocalisation non supportée.</p>`;
      }
    });
  }

  if (citySelector) {
    citySelector.addEventListener('change', () => {
      const city = citySelector.value;
      if (city) fetchAirQuality({ city });
    });
  }
});
