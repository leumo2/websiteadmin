// pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string }>;
  wind: { speed: number };
}

export default function Home() {
  const [city, setCity] = useState('Jakarta');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/weather', {
        params: { city: cityName }
      });
      
      if (response.data.success) {
        setWeather(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
          <p className="text-blue-100">Real-time weather powered by Next.js</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center text-white">
            <p>Loading weather data...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Weather Card */}
        {weather && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {weather.weather[0].main}
              </p>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-gray-600">Feels Like</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(weather.main.feels_like)}°C
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Humidity</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {weather.main.humidity}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Wind Speed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {weather.wind.speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
