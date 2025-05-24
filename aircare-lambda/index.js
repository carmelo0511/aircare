const AWS = require("aws-sdk");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AQIHistory";

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.info("Event body:", body);

    const { lat, lon } = body;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!lat || !lon || !apiKey) {
      console.error("API key is undefined!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const [airResponse, weatherResponse] = await Promise.all([
      axios.get(airUrl),
      axios.get(weatherUrl),
    ]);

    const airData = airResponse.data;
    const weatherData = weatherResponse.data;

    const timestamp = new Date().toISOString();

    const item = {
      requestId: uuidv4(), // ⚠️ correspond à la clé primaire de ta table DynamoDB
      timestamp,
      lat,
      lon,
      aqi: airData.list[0].main.aqi,
      temp: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      city: weatherData.name,
    };

    await dynamo.put({
      TableName: TABLE_NAME,
      Item: item,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };

  } catch (error) {
    console.error("Lambda error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
