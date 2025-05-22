const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { lat, lon } = JSON.parse(event.body);
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // 1) Reverse-géocoding
    const geoRes = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const city = geoRes.data[0]?.name || 'Lieu inconnu';

    // 2) Pollution
    const pollRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        city,
        data: pollRes.data
      }),
    };
  } catch (error) {
    console.error("Erreur Lambda:", error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'API call failed' }),
    };
  }
};
