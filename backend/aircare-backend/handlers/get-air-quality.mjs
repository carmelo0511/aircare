import axios from 'axios';

export const lambdaHandler = async (event) => {
  try {
    const { lat, lon } = JSON.parse(event.body);

    const apiKey = process.env.API_KEY;
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
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        aqi,
        niveau: statusMap[aqi],
      }),
    };
  } catch (error) {
    console.error("Erreur API qualité de l’air :", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ message: "Erreur récupération qualité de l’air" }),
    };
  }
};

