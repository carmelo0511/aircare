import React from "react";
import { MapPin, Wind, Thermometer, AlertTriangle } from "lucide-react";

export default function AirCareApp({ data }) {
  if (!data) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-900">AirCare</h1>
        <p className="text-center text-blue-700 text-lg">
          Qualité de l’air en temps réel pour les utilisateurs asthmatiques
        </p>

        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-8">
          {/* Localisation */}
          <div className="flex items-center space-x-2 justify-center">
            <MapPin className="text-blue-700" />
            <p className="text-lg font-medium text-gray-800">{data.location}</p>
          </div>

          {/* Grid metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <AlertTriangle className="mx-auto text-red-500" size={32} />
              <p className="text-sm text-gray-600 mt-1">Indice AQI</p>
              <p className="text-2xl font-semibold text-gray-900">{data.aqi}</p>
            </div>
            <div>
              <Wind className="mx-auto text-blue-600" size={32} />
              <p className="text-sm text-gray-600 mt-1">PM2.5</p>
              <p className="text-2xl font-semibold text-gray-900">{data.pm25} µg/m³</p>
            </div>
            <div>
              <Thermometer className="mx-auto text-yellow-500" size={32} />
              <p className="text-sm text-gray-600 mt-1">Température</p>
              <p className="text-2xl font-semibold text-gray-900">{data.temperature} °C</p>
            </div>
            <div>
              <Wind className="mx-auto text-green-600 rotate-90" size={32} />
              <p className="text-sm text-gray-600 mt-1">Humidité</p>
              <p className="text-2xl font-semibold text-gray-900">{data.humidity} %</p>
            </div>
          </div>

          {/* Astuce */}
          <div className="pt-2 text-center">
            <p className="text-gray-700 text-sm italic">
              Astuce : évitez de sortir si l’AQI dépasse 100.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

