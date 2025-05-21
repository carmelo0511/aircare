async function getAirQuality() {
  if (!navigator.geolocation) {
    alert("Géolocalisation non supportée");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById("location").innerText = `Position : ${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    try {
      const response = await fetch("https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });

      const data = await response.json();
      const aqi = data.list[0].main.aqi;
      const pm25 = data.list[0].components.pm2_5;
      const pm10 = data.list[0].components.pm10;

      document.getElementById("results").innerHTML = `
        <h2>Qualité de l'air</h2>
        <p><strong>AQI :</strong> ${aqi}</p>
        <p><strong>PM2.5 :</strong> ${pm25} µg/m³</p>
        <p><strong>PM10 :</strong> ${pm10} µg/m³</p>
      `;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'appel à l'API");
    }
  });
}
