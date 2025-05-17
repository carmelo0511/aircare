import React, { useEffect, useState } from "react";
import AirCareApp from "./components/AirCareApp";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      fetch("https://q2ntad65mi.execute-api.ca-central-1.amazonaws.com/Prod/airquality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat: latitude, lon: longitude }),
      })
        .then((res) => res.json())
        .then((resData) => {
          console.log("🟢 Données API :", resData);
          setData({
            location: resData.city,
            aqi: resData.aqi,
            pm25: resData.pm25,
            humidity: resData.humidity,
            temperature: resData.temperature,
          });
        })
        .catch((err) => console.error("Erreur API :", err));
    });
  }, []);

  return <AirCareApp data={data} />;
}

export default App;

