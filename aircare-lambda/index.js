const AWS = require("aws-sdk");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AQIHistory";

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { lat, lon } = body;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!lat || !lon || !apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing lat/lon or API key" }),
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

    const result = {
      city: weatherData.name,
      temp: weatherData.main?.temp ?? null,
      humidity: weatherData.main?.humidity ?? null,
      aqi: airData.list?.[0]?.main?.aqi ?? null
    };

    // Enregistrement dans DynamoDB
    await dynamo.put({
      TableName: TABLE_NAME,
      Item: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
        lat,
        lon,
        ...result
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("Lambda error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
