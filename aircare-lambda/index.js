const axios = require("axios");

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { lat, lon } = body;

    const apiKey = process.env.WEATHER_API_KEY;
    if (!lat || !lon || !apiKey) {
      throw new Error("Missing lat/lon or WEATHER_API_KEY");
    }

    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;

    const [airRes, weatherRes] = await Promise.all([
      axios.get(airUrl),
      axios.get(weatherUrl),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        city: weatherRes.data.name || "Unknown",
        data: {
          list: airRes.data.list,
          weather: weatherRes.data.weather,
        },
      }),
    };
  } catch (err) {
    console.error("Lambda error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Lambda failed",
        details: err.message,
      }),
    };
  }
};
