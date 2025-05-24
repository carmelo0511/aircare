document.addEventListener("DOMContentLoaded", () => {
  const getAirQualityBtn = document.getElementById("getAirQuality");
  const citySelector = document.getElementById("citySelector");
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loader");

  async function fetchData(lat, lon, city = "Inconnue") {
    loader.classList.remove("hidden");
    resultDiv.innerHTML = "";

    try {
      const response = await fetch("https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });

      const data = await response.json();
      loader.classList.add("hidden");

      if (data.error) {
        resultDiv.innerHTML = `<p class="text-red-500 font-bold">Erreur : ${data.error}</p>`;
        return;
      }

      const { city, temp, humidity, aqi } = data;
      resultDiv.innerHTML = `
        <div class="mt-4 bg-yellow-400 text-black p-4 rounded-lg shadow-lg">
          <p><strong>Ville :</strong> ${city}</p>
          <p><strong>Température :</strong> ${temp}°C</p>
          <p><strong>Humidité :</strong> ${humidity}%</p>
          <p><strong>Qualité de l’air (AQI) :</strong> ${aqi}</p>
        </div>
      `;
    } catch (error) {
      loader.classList.add("hidden");
      resultDiv.innerHTML = `<p class="text-red-500 font-bold">Erreur : ${error.message}</p>`;
    }
  }

  getAirQualityBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchData(latitude, longitude);
        },
        () => {
          resultDiv.innerHTML = "<p class='text-red-500 font-bold'>Géolocalisation refusée.</p>";
        }
      );
    } else {
      resultDiv.innerHTML = "<p class='text-red-500 font-bold'>Géolocalisation non supportée.</p>";
    }
  });

  citySelector.addEventListener("change", (e) => {
    const city = e.target.value;
    const coords = {
      Montreal: { lat: 45.5017, lon: -73.5673 },
      Toronto: { lat: 43.65107, lon: -79.347015 },
      Paris: { lat: 48.8566, lon: 2.3522 },
      Nice: { lat: 43.7102, lon: 7.2620 },
    };

    if (coords[city]) {
      fetchData(coords[city].lat, coords[city].lon, city);
    }
  });
});
