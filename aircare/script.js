document.addEventListener('DOMContentLoaded', () => {
  const getAirQualityBtn = document.getElementById('getAirQuality');
  const citySelector = document.getElementById('citySelector');
  const resultDiv = document.getElementById('result');
  const loader = document.getElementById('loader');

  async function fetchAirQuality(data) {
    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
      const response = await fetch('https://api.aircare.bryan.cloud/air', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await response.json();
      if (!json || !json.data) {
        throw new Error('Réponse invalide');
      }

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

  getAirQualityBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchAirQuality({ latitude, longitude });
        },
        error => {
          resultDiv.innerHTML = `<p class="text-red-600">Géolocalisation refusée ou échouée.</p>`;
        }
      );
    } else {
      resultDiv.innerHTML = `<p class="text-red-600">Géolocalisation non prise en charge.</p>`;
    }
  });

  citySelector.addEventListener('change', () => {
    const city = citySelector.value;
    if (city) {
      fetchAirQuality({ city });
    }
  });
});
