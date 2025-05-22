async function getAirQuality() {
  if (!navigator.geolocation) {
    return alert("Géolocalisation non supportée");
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      document.getElementById("location").innerText = "Recherche de la ville...";

      try {
        const res = await fetch(
          "https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          return alert("API Error : " + JSON.stringify(err));
        }

        const { city, data } = await res.json();

        // Affiche la ville
        document.getElementById("location").innerText = `Ville : ${city}`;

        // Récupère la première entrée AQI
        const entry = data.list[0];
        const { aqi } = entry.main;
        const { pm2_5, pm10 } = entry.components;

        // Affiche les résultats
        document.getElementById("results").innerHTML = `
          <h2>Qualité de l'air à ${city}</h2>
          <p><strong>AQI :</strong> ${aqi}</p>
          <p><strong>PM2.5 :</strong> ${pm2_5} µg/m³</p>
          <p><strong>PM10 :</strong> ${pm10} µg/m³</p>
        `;
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'appel à l'API");
      }
    },
    () => alert("Impossible de récupérer la géolocalisation")
  );
}
