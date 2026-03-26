const KEYS = {
  SELECTED_CITY: 'weather_selectedCity',
  RECENT_CITIES: 'weather_recentCities',
  WEATHER_DATA:  'weather_weatherData',
  UNITS:         'weather_units',
};

const Storage = {
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch { return def; }
  },
  saveSelectedCity: (city) => Storage.set(KEYS.SELECTED_CITY, city),
  getSelectedCity:  ()     => Storage.get(KEYS.SELECTED_CITY, null),
  saveUnits:  (u)  => Storage.set(KEYS.UNITS, u),
  getUnits:   ()   => Storage.get(KEYS.UNITS, 'metric'),
  getRecentCities: () => Storage.get(KEYS.RECENT_CITIES, []),
  addRecentCity(city) {
    let cities = Storage.getRecentCities().filter(c => !(c.lat === city.lat && c.lon === city.lon));
    cities.unshift(city);
    Storage.set(KEYS.RECENT_CITIES, cities.slice(0, 5));
    return cities.slice(0, 5);
  },
  saveWeatherData: (data) => Storage.set(KEYS.WEATHER_DATA, { ...data, cachedAt: Date.now() }),
  getWeatherData() {
    const d = Storage.get(KEYS.WEATHER_DATA, null);
    if (!d) return null;
    if (Date.now() - d.cachedAt > 10 * 60 * 1000) { localStorage.removeItem(KEYS.WEATHER_DATA); return null; }
    return d;
  },
};

export default Storage;
