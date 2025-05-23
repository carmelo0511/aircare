const apiUrl = "https://khwxkc19ui.execute-api.ca-central-1.amazonaws.com/air";
const resultBox = document.getElementById("result");
const button = document.getElementById("fetchButton");

const getAQIMessage = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        message: "✅ L’air est très bon pour les personnes asthmatiques.",
        class: "good"
      };
    case 2:
      return {
        message: "🟢 L’air est acceptable mais peut gêner les personnes très sensibles.",
        class: "moderate"
      };
    case 3:
      return {
        message: "🟡 L’air peut être gênant pour les personnes asthmatiques sensibles.",
        class: "unhealthy-sensitive"
      };
    case 4:
      return {
        message: "🟠 L’air est mauvais pour les personnes asthmatiques.",
        class: "unhealthy"
      };
    case 5:
      return {
        message: "🔴 L’air est très mauvais pour les personnes asthmatiques. Évitez les sorties.",
        class: "very-unhealthy"
      };
    default:
      return {
        message: "⚠️ Indice de qualité de l'air inconnu.",
        class: "unknown"
      };
  }
};

const displayData = (data) => {
  const { city, data: airData, weather } = data;

  const aqi = airData.list[0].main.aqi;
  const components = airData.list[0].components;
  const weatherData = weather?.[0];

  const messageData = getAQIMessage(aqi);

  resultBox.innerHTML = `
    <div class="card">
      <h2>${city}</h2>
      ${weatherData ? `
        <img src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="${weatherData.description}" />
        <p><strong>Météo :</strong> ${weatherData.main} (${weatherData.description})</p>
      ` : ""}
      <p><strong>Indice Qualité de l’air (AQI) :</strong> ${aqi}</p>
      <div class="alert ${messageData.class}">
        ${messageData.message}
      </div>
      <h3>Composants (µg/m³)</h3>
      <pre>${Object.entries(components).map(([k, v]) => `${k.toUpperCase()} : ${v}`).join('\n')}</pre>
    </div>
  `;
};

const fetchData = (lat, lon) => {
  resultBox.innerHTML = "Chargement...";
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon })
  })
    .then(res => res.json())
    .then(data => {
      if (data?.data?.list) {
        displayData(data);
      } else {
        throw new Error("Réponse invalide");
      }
    })
    .catch(err => {
      console.error(err);
      resultBox.innerHTML = `<div class="alert error">❌ Erreur lors de la récupération des données.</div>`;
    });
};

button.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchData(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert("Impossible de récupérer la position. Veuillez autoriser l’accès à la localisation.");
      }
    );
  } else {
    alert("La géolocalisation n’est pas prise en charge par ce navigateur.");
  }
});
