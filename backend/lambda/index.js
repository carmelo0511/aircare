const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { lat, lon } = JSON.parse(event.body);

    const apiKey = process.env.API_KEY; // À configurer dans Lambda (clé OpenWeather)
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(url);
    const aqi = response.data.list[0].main.aqi;

    const statusMap = {
      1: "Bonne",
      2: "Acceptable",
      3: "Modérée",
      4: "Mauvaise",
      5: "Dangereuse",
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aqi,
        niveau: statusMap[aqi],
      }),
    };
  } catch (error) {
    console.error("Erreur API air :", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur lors de la récupération de la qualité de l’air." }),
    };
  }
};

