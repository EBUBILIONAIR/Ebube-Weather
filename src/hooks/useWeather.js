import { useState, useEffect, useCallback, useRef } from 'react';
import * as API from '../utils/api';
import Storage from '../utils/storage';

export function useWeather() {
  const [weatherData, setWeatherData]   = useState(null);
  const [currentCity, setCurrentCity]   = useState(null);
  const [recentCities, setRecentCities] = useState([]);
  const [newsData, setNewsData]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [units, setUnitsState]          = useState(() => Storage.getUnits());
  const [weatherCache, setWeatherCache] = useState({});
  const cacheRef = useRef({});

  // Load news once
  useEffect(() => {
    API.getWeatherNews().then(setNewsData).catch(() => {});
  }, []);

  // Load recent cities weather
  const loadRecentWeather = useCallback(async (cities) => {
    const toFetch = cities.slice(0, 3).filter(c => !cacheRef.current[`${c.lat},${c.lon}`]);
    await Promise.all(toFetch.map(async c => {
      try {
        const d = await API.getOneCall(c.lat, c.lon);
        cacheRef.current[`${c.lat},${c.lon}`] = d;
      } catch {}
    }));
    setWeatherCache({ ...cacheRef.current });
  }, []);

  const fetchCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [oneCall, airQuality] = await Promise.all([
        API.getOneCall(city.lat, city.lon),
        API.getAirQuality(city.lat, city.lon),
      ]);
      const data = { ...oneCall, airQuality };
      cacheRef.current[`${city.lat},${city.lon}`] = data;
      setWeatherCache({ ...cacheRef.current });
      setWeatherData(data);
      setCurrentCity(city);
      Storage.saveSelectedCity(city);
      Storage.saveWeatherData(data);
    } catch (e) {
      setError('Could not load weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCity = useCallback(async (city) => {
    const updated = Storage.addRecentCity(city);
    setRecentCities(updated);
    await fetchCity(city);
    loadRecentWeather(updated);
  }, [fetchCity, loadRecentWeather]);

  const toggleUnits = useCallback(() => {
    const next = units === 'metric' ? 'imperial' : 'metric';
    Storage.saveUnits(next);
    setUnitsState(next);
    if (currentCity) fetchCity(currentCity);
  }, [units, currentCity, fetchCity]);

  // Init
  useEffect(() => {
    const recent = Storage.getRecentCities();
    setRecentCities(recent);
    const cached = Storage.getWeatherData();
    const savedCity = Storage.getSelectedCity();
    if (cached && savedCity) {
      setWeatherData(cached);
      setCurrentCity(savedCity);
      setLoading(false);
      loadRecentWeather(recent);
    } else if (savedCity) {
      fetchCity(savedCity).then(() => loadRecentWeather(recent));
    } else {
      fetchCity({ name:'London', country:'GB', state:'England', lat:51.5074, lon:-0.1278 })
        .then(() => loadRecentWeather(recent));
    }
  }, []); // eslint-disable-line

  return { weatherData, currentCity, recentCities, newsData, loading, error,
           units, weatherCache, selectCity, toggleUnits };
}
