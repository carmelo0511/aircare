document.addEventListener('DOMContentLoaded', () => {
  const getAirQualityBtn = document.getElementById('getAirQuality');
  const citySelector     = document.getElementById('citySelector');
  const resultDiv        = document.getElementById('result');
  const loader           = document.getElementById('loader');

  // En local on pointe directement vers l’API Gateway, en prod on utilise le path relatif.
  const baseURL  = window.location.hostname.includes('localhost')
    ? 'https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com'
    : '';
  const endpoint = `${baseURL}/air`;

  async function fetchAirQuality(data) {
    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!json?.data) throw new Error('Réponse invalide');

      const { city, aqi, category, advice } = json.data;
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
