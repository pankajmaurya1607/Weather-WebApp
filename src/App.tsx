import React, { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Droplets,
  Thermometer,
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind
} from 'lucide-react';
import { WeatherData, WeatherError } from './types';

const API_KEY = '4a703b5bb1ac4fc0abb7b598b0136a1e';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [geoLoading, setGeoLoading] = useState(false);

  const getWeatherIcon = (code: string) => {
    const size = 40;
    const props = { size, className: "text-blue-500" };
    
    // Map weather codes to Lucide icons
    if (code.startsWith('01')) return <Sun {...props} />;
    if (code.startsWith('02') || code.startsWith('03') || code.startsWith('04')) return <Cloud {...props} />;
    if (code.startsWith('09')) return <CloudDrizzle {...props} />;
    if (code.startsWith('10')) return <CloudRain {...props} />;
    if (code.startsWith('11')) return <CloudLightning {...props} />;
    if (code.startsWith('13')) return <CloudSnow {...props} />;
    if (code.startsWith('50')) return <CloudFog {...props} />;
    return <Cloud {...props} />;
  };

  const fetchWeather = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city.trim() && !e) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
          );
          
          if (!response.ok) {
            throw new Error('Location not found');
          }
          
          const data: WeatherData = await response.json();
          setWeather(data);
          setCity(data.name);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          setWeather(null);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setError('Failed to get location. Please enable location services.');
        setGeoLoading(false);
      }
    );
  };

  // Refetch weather when unit changes
  useEffect(() => {
    if (weather) {
      fetchWeather();
    }
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Weather Forecast
          </h1>
          <button
            onClick={toggleUnit}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            °{unit === 'metric' ? 'C' : 'F'}
          </button>
        </div>
        
        <form onSubmit={fetchWeather} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Get Weather'
              )}
            </button>
            
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
            >
              {geoLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {weather.name}, {weather.sys.country}
              </h2>
              <div className="mt-4 flex justify-center">
                {getWeatherIcon(weather.weather[0].icon)}
              </div>
              <p className="text-5xl font-bold text-gray-800 mt-2">
                {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </p>
              <p className="text-gray-600 capitalize mt-1">
                {weather.weather[0].description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                <Thermometer className="text-blue-500 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600">Feels Like</p>
                  <p className="font-semibold text-gray-800">
                    {Math.round(weather.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                <Droplets className="text-blue-500 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-semibold text-gray-800">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                <Wind className="text-blue-500 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="font-semibold text-gray-800">
                    {Math.round(weather.wind.speed)} {unit === 'metric' ? 'm/s' : 'mph'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                <MapPin className="text-blue-500 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600">Pressure</p>
                  <p className="font-semibold text-gray-800">
                    {weather.main.pressure} hPa
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

export default App;