const API_URL = "https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air"; // Ton endpoint
const getAirQualityBtn = document.getElementById("getAirQuality");
const citySelector = document.getElementById("citySelector");
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");

getAirQualityBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    loader.classList.remove("hidden");
    resultDiv.innerHTML = "";
    navigator.geolocation.getCurrentPosition(
      pos => sendRequest(pos.coords.latitude, pos.coords.longitude),
      () => showError("Géolocalisation refusée.")
    );
  } else {
    showError("Géolocalisation non supportée.");
  }
});

citySelector.addEventListener("change", () => {
  const city = citySelector.value;
  if (!city) return;

  const cities = {
    "Montreal": { lat: 45.5017, lon: -73.5673 },
    "Toronto": { lat: 43.65107, lon: -79.347015 },
    "Paris": { lat: 48.8566, lon: 2.3522 },
    "Nice": { lat: 43.7102, lon: 7.2620 }
  };

  const { lat, lon } = cities[city];
  loader.classList.remove("hidden");
  resultDiv.innerHTML = "";
  sendRequest(lat, lon);
});

function sendRequest(lat, lon) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon })
  })
    .then(res => res.json())
    .then(data => {
      loader.classList.add("hidden");
      if (data.error) {
        showError(data.error);
      } else {
        const aqi = data.aqi;
        const color = getColor(aqi);
        resultDiv.innerHTML = `
          <div class="p-4 rounded shadow text-white ${color}">
            <p><strong>Ville :</strong> ${data.city}</p>
            <p><strong>Température :</strong> ${data.temp}°C</p>
            <p><strong>Humidité :</strong> ${data.humidity}%</p>
            <p><strong>Qualité de l’air (AQI) :</strong> ${aqi}</p>
          </div>`;
      }
    })
    .catch(() => {
      loader.classList.add("hidden");
      showError("Erreur réseau.");
    });
}

function getColor(aqi) {
  if (aqi <= 1) return "bg-green-500";
  if (aqi <= 2) return "bg-yellow-400";
  if (aqi <= 3) return "bg-orange-500";
  return "bg-red-600";
}

function showError(message) {
  loader.classList.add("hidden");
  resultDiv.innerHTML = `<p class="text-red-600">${message}</p>`;
}
