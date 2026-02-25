'use client';

import Card from "../ui/Card";

/**
 * WeatherDisplay Component - Show current weather and forecast
 * Displays real-time and predicted weather conditions
 */



export default function WeatherDisplay({ weatherData }) {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Partly Cloudy': '🌤️',
      'Stormy': '⛈️',
      'Windy': '💨',
    };
    return iconMap[condition] || '🌤️';
  };

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card title="Current Weather" icon="🌤️">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-5xl mb-2">{getWeatherIcon(weatherData.current.condition)}</p>
            <p className="font-bold text-lg text-green-800">{weatherData.current.temperature}°C</p>
            <p className="text-sm text-gray-600">{weatherData.current.condition}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Feels Like</p>
            <p className="font-bold text-lg">{weatherData.current.feelsLike}°C</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Humidity</p>
            <p className="font-bold text-lg">{weatherData.current.humidity}%</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Wind Speed</p>
            <p className="font-bold text-lg">{weatherData.current.windSpeed} km/h</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">UV Index</p>
            <p className="font-bold text-lg">{weatherData.current.uvIndex}</p>
          </div>
        </div>
      </Card>

      {/* Forecast */}
      <Card title="7-Day Forecast" icon="📅">
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex-shrink-0 bg-gradient-light rounded-lg p-4 text-center min-w-max">
                <p className="font-bold text-gray-800 mb-2">{day.day}</p>
                <p className="text-3xl mb-2">{getWeatherIcon(day.condition)}</p>
                <div className="text-sm">
                  <p className="text-gray-700">
                    <span className="font-bold text-green-800">{day.high}°</span> /
                    <span className="text-blue-600"> {day.low}°</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{day.condition}</p>
                  {day.precipitation > 0 && (
                    <p className="text-xs text-blue-600 mt-1">💧 {day.precipitation}mm</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Weather Alerts */}
      <Card title="Weather Alerts" icon="⚠️">
        <div className="space-y-3">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="font-semibold text-yellow-800">⚠️ Heavy Rain Expected</p>
            <p className="text-sm text-yellow-700 mt-1">Avoid irrigation in next 48 hours. Post-rain activities recommended.</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="font-semibold text-blue-800">ℹ️ Humidity Alert</p>
            <p className="text-sm text-blue-700 mt-1">High humidity increases disease risk. Consider preventive spray.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
