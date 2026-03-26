import Storage from './storage';

const WEATHER_API_KEY = 'a5d446b7380008f98309ce1e5cf1b5a2';
const NEWS_API_KEY    = 'c6ae70e2229b421e8d8d441e2a50bc7f';
const BASE            = 'https://api.openweathermap.org';
const NEWS_BASE       = 'https://newsapi.org/v2';

export async function searchCities(query) {
  if (!query || query.length < 2) return [];
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${WEATHER_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return getMockCities(query);
    return data.map(c => ({
      name: c.name, country: c.country, state: c.state || '',
      lat: c.lat, lon: c.lon,
      displayName: c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}`,
    }));
  } catch { return getMockCities(query); }
}

export async function getCityFromCoords(lat, lon) {
  const url = `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (!data.length) return null;
    const c = data[0];
    return { name: c.name, country: c.country, state: c.state || '', lat, lon,
      displayName: c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}` };
  } catch { return null; }
}

export async function getOneCall(lat, lon) {
  const units = Storage.getUnits();
  const url = `${BASE}/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return getForecastFallback(lat, lon);
  }
}

async function getForecastFallback(lat, lon) {
  try {
    const units = Storage.getUnits();
    const [cr, fr] = await Promise.all([
      fetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`).then(r => r.json()),
      fetch(`${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`).then(r => r.json()),
    ]);
    return normalizeToOneCall(cr, fr);
  } catch { return getMockOneCall(); }
}

function normalizeToOneCall(current, forecast) {
  const hourly = forecast.list.slice(0, 48).map(item => ({
    dt: item.dt, temp: item.main.temp, feels_like: item.main.feels_like,
    humidity: item.main.humidity, wind_speed: item.wind.speed, wind_deg: item.wind.deg,
    weather: item.weather, pop: item.pop || 0, clouds: { all: item.clouds.all }, uvi: 0,
  }));
  const dailyMap = {};
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) dailyMap[date] = { dt: item.dt, temps: [], weather: item.weather,
      pop: item.pop || 0, humidity: item.main.humidity, wind_speed: item.wind.speed, clouds: item.clouds.all };
    dailyMap[date].temps.push(item.main.temp);
  });
  const daily = Object.values(dailyMap).slice(0, 10).map(day => ({
    dt: day.dt,
    temp: { min: Math.min(...day.temps), max: Math.max(...day.temps),
      day: day.temps[Math.floor(day.temps.length / 2)], night: day.temps[day.temps.length - 1] },
    weather: day.weather, pop: day.pop, humidity: day.humidity,
    wind_speed: day.wind_speed, clouds: day.clouds, uvi: 0,
    sunrise: current.sys.sunrise, sunset: current.sys.sunset, moonrise: 0, moonset: 0, moon_phase: 0.5,
  }));
  return {
    lat: current.coord.lat, lon: current.coord.lon, timezone: current.timezone,
    current: {
      dt: current.dt, sunrise: current.sys.sunrise, sunset: current.sys.sunset,
      temp: current.main.temp, feels_like: current.main.feels_like,
      pressure: current.main.pressure, humidity: current.main.humidity,
      dew_point: current.main.temp - ((100 - current.main.humidity) / 5),
      uvi: 0, clouds: current.clouds.all, visibility: current.visibility,
      wind_speed: current.wind.speed, wind_deg: current.wind.deg, weather: current.weather,
    },
    hourly, daily,
  };
}

export async function getAirQuality(lat, lon) {
  const url = `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch { return null; }
}

export async function getWeatherNews() {
  const url = `${NEWS_BASE}/everything?q=weather+climate+storm&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.articles || getMockNews();
  } catch { return getMockNews(); }
}

// ── MOCK DATA ────────────────────────────────────────────────────────────────

function getMockCities(query) {
  const q = query.toLowerCase();
  return [
    { name:'London',        country:'GB', state:'England',          lat:51.5074,  lon:-0.1278  },
    { name:'Lagos',         country:'NG', state:'Lagos',            lat:6.5244,   lon:3.3792   },
    { name:'Los Angeles',   country:'US', state:'California',       lat:34.0522,  lon:-118.2437},
    { name:'Lahore',        country:'PK', state:'Punjab',           lat:31.5497,  lon:74.3436  },
    { name:'Lima',          country:'PE', state:'Lima',             lat:-12.0464, lon:-77.0428 },
    { name:'Lisbon',        country:'PT', state:'Lisbon',           lat:38.7223,  lon:-9.1393  },
    { name:'Lyon',          country:'FR', state:'Auvergne-Rhône',   lat:45.7640,  lon:4.8357   },
    { name:'New York',      country:'US', state:'New York',         lat:40.7128,  lon:-74.0060 },
    { name:'Nairobi',       country:'KE', state:'Nairobi',          lat:-1.2921,  lon:36.8219  },
    { name:'Paris',         country:'FR', state:'Île-de-France',    lat:48.8566,  lon:2.3522   },
    { name:'Tokyo',         country:'JP', state:'Tokyo',            lat:35.6762,  lon:139.6503 },
    { name:'Dubai',         country:'AE', state:'Dubai',            lat:25.2048,  lon:55.2708  },
    { name:'Abuja',         country:'NG', state:'FCT',              lat:9.0579,   lon:7.4951   },
    { name:'Berlin',        country:'DE', state:'Berlin',           lat:52.5200,  lon:13.4050  },
    { name:'Cairo',         country:'EG', state:'Cairo',            lat:30.0444,  lon:31.2357  },
    { name:'Mumbai',        country:'IN', state:'Maharashtra',      lat:19.0760,  lon:72.8777  },
    { name:'Sydney',        country:'AU', state:'New South Wales',  lat:-33.8688, lon:151.2093 },
    { name:'Toronto',       country:'CA', state:'Ontario',          lat:43.6532,  lon:-79.3832 },
    { name:'Chicago',       country:'US', state:'Illinois',         lat:41.8781,  lon:-87.6298 },
    { name:'Houston',       country:'US', state:'Texas',            lat:29.7604,  lon:-95.3698 },
    { name:'Madrid',        country:'ES', state:'Madrid',           lat:40.4168,  lon:-3.7038  },
    { name:'Mexico City',   country:'MX', state:'CDMX',             lat:19.4326,  lon:-99.1332 },
    { name:'São Paulo',     country:'BR', state:'São Paulo',        lat:-23.5505, lon:-46.6333 },
    { name:'Buenos Aires',  country:'AR', state:'Buenos Aires',     lat:-34.6037, lon:-58.3816 },
    { name:'Johannesburg',  country:'ZA', state:'Gauteng',          lat:-26.2041, lon:28.0473  },
    { name:'Moscow',        country:'RU', state:'Moscow',           lat:55.7558,  lon:37.6173  },
    { name:'Istanbul',      country:'TR', state:'Istanbul',         lat:41.0082,  lon:28.9784  },
    { name:'Seoul',         country:'KR', state:'Seoul',            lat:37.5665,  lon:126.9780 },
    { name:'Bangkok',       country:'TH', state:'Bangkok',          lat:13.7563,  lon:100.5018 },
    { name:'Jakarta',       country:'ID', state:'Jakarta',          lat:-6.2088,  lon:106.8456 },
    { name:'Singapore',     country:'SG', state:'',                 lat:1.3521,   lon:103.8198 },
    { name:'Accra',         country:'GH', state:'Greater Accra',    lat:5.5560,   lon:-0.1969  },
    { name:'Dakar',         country:'SN', state:'Dakar',            lat:14.7167,  lon:-17.4677 },
    { name:'Casablanca',    country:'MA', state:'Casablanca',       lat:33.5731,  lon:-7.5898  },
    { name:'Addis Ababa',   country:'ET', state:'Addis Ababa',      lat:9.0300,   lon:38.7400  },
    { name:'Amsterdam',     country:'NL', state:'North Holland',    lat:52.3676,  lon:4.9041   },
    { name:'Rome',          country:'IT', state:'Lazio',            lat:41.9028,  lon:12.4964  },
    { name:'Athens',        country:'GR', state:'Attica',           lat:37.9838,  lon:23.7275  },
    { name:'Barcelona',     country:'ES', state:'Catalonia',        lat:41.3851,  lon:2.1734   },
    { name:'Vienna',        country:'AT', state:'Vienna',           lat:48.2082,  lon:16.3738  },
    { name:'Prague',        country:'CZ', state:'Prague',           lat:50.0755,  lon:14.4378  },
    { name:'Warsaw',        country:'PL', state:'Masovian',         lat:52.2297,  lon:21.0122  },
    { name:'Budapest',      country:'HU', state:'Budapest',         lat:47.4979,  lon:19.0402  },
    { name:'Brussels',      country:'BE', state:'Brussels',         lat:50.8503,  lon:4.3517   },
    { name:'Stockholm',     country:'SE', state:'Stockholm',        lat:59.3293,  lon:18.0686  },
    { name:'Oslo',          country:'NO', state:'Oslo',             lat:59.9139,  lon:10.7522  },
    { name:'Helsinki',      country:'FI', state:'Uusimaa',          lat:60.1699,  lon:24.9384  },
    { name:'Copenhagen',    country:'DK', state:'Capital Region',   lat:55.6761,  lon:12.5683  },
    { name:'Dublin',        country:'IE', state:'Leinster',         lat:53.3498,  lon:-6.2603  },
    { name:'Edinburgh',     country:'GB', state:'Scotland',         lat:55.9533,  lon:-3.1883  },
    { name:'Manchester',    country:'GB', state:'England',          lat:53.4808,  lon:-2.2426  },
    { name:'Miami',         country:'US', state:'Florida',          lat:25.7617,  lon:-80.1918 },
    { name:'San Francisco', country:'US', state:'California',       lat:37.7749,  lon:-122.4194},
    { name:'Seattle',       country:'US', state:'Washington',       lat:47.6062,  lon:-122.3321},
    { name:'Atlanta',       country:'US', state:'Georgia',          lat:33.7490,  lon:-84.3880 },
    { name:'Denver',        country:'US', state:'Colorado',         lat:39.7392,  lon:-104.9903},
    { name:'Phoenix',       country:'US', state:'Arizona',          lat:33.4484,  lon:-112.0740},
    { name:'Vancouver',     country:'CA', state:'British Columbia', lat:49.2827,  lon:-123.1207},
    { name:'Karachi',       country:'PK', state:'Sindh',            lat:24.8607,  lon:67.0011  },
    { name:'Dhaka',         country:'BD', state:'Dhaka',            lat:23.8103,  lon:90.4125  },
    { name:'Kolkata',       country:'IN', state:'West Bengal',      lat:22.5726,  lon:88.3639  },
    { name:'Delhi',         country:'IN', state:'Delhi',            lat:28.7041,  lon:77.1025  },
    { name:'Kabul',         country:'AF', state:'Kabul',            lat:34.5253,  lon:69.1783  },
    { name:'Riyadh',        country:'SA', state:'Riyadh',           lat:24.7136,  lon:46.6753  },
    { name:'Kuwait City',   country:'KW', state:'Al Asimah',        lat:29.3759,  lon:47.9774  },
    { name:'Doha',          country:'QA', state:'Ad Dawhah',        lat:25.2854,  lon:51.5310  },
    { name:'Abu Dhabi',     country:'AE', state:'Abu Dhabi',        lat:24.4539,  lon:54.3773  },
    { name:'Muscat',        country:'OM', state:'Muscat',           lat:23.5880,  lon:58.3829  },
    { name:'Beirut',        country:'LB', state:'Beirut',           lat:33.8938,  lon:35.5018  },
    { name:'Amman',         country:'JO', state:'Amman',            lat:31.9454,  lon:35.9284  },
    { name:'Bogotá',        country:'CO', state:'Cundinamarca',     lat:4.7110,   lon:-74.0721 },
    { name:'Santiago',      country:'CL', state:'Santiago',         lat:-33.4489, lon:-70.6693 },
    { name:'Lima',          country:'PE', state:'Lima',             lat:-12.0464, lon:-77.0428 },
    { name:'Nairobi',       country:'KE', state:'Nairobi',          lat:-1.2921,  lon:36.8219  },
    { name:'Kampala',       country:'UG', state:'Kampala',          lat:0.3136,   lon:32.5811  },
    { name:'Kinshasa',      country:'CD', state:'Kinshasa',         lat:-4.3217,  lon:15.3222  },
    { name:'Lusaka',        country:'ZM', state:'Lusaka',           lat:-15.4167, lon:28.2833  },
    { name:'Harare',        country:'ZW', state:'Harare',           lat:-17.8292, lon:31.0522  },
    { name:'Cape Town',     country:'ZA', state:'Western Cape',     lat:-33.9249, lon:18.4241  },
  ]
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map(c => ({ ...c, displayName: c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}` }));
}

function getMockOneCall() {
  const now = Math.floor(Date.now() / 1000);
  const icons = ['01d','02d','10d','04d','01n','11d','02n','13d'];
  const hourly = Array.from({ length: 48 }, (_, i) => ({
    dt: now + i * 3600,
    temp: 18 + Math.sin(i * 0.26) * 7 + Math.random() * 2,
    feels_like: 16 + Math.sin(i * 0.26) * 6,
    humidity: 60 + Math.floor(Math.random() * 25),
    wind_speed: 3 + Math.random() * 6,
    wind_deg: Math.floor(Math.random() * 360),
    weather: [{ icon: icons[i % icons.length], description: 'Partly cloudy', main: 'Clouds' }],
    pop: Math.random() * 0.5,
    clouds: { all: Math.floor(Math.random() * 80) },
    uvi: i > 6 && i < 18 ? Math.random() * 8 : 0,
  }));
  const daily = Array.from({ length: 10 }, (_, i) => ({
    dt: now + i * 86400,
    sunrise: now + i * 86400 + 21600, sunset: now + i * 86400 + 64800,
    moonrise: now + i * 86400 + 43200, moonset: now + i * 86400 + 86400,
    moon_phase: (i * 0.1) % 1,
    temp: { min: 12 + Math.random() * 4, max: 22 + Math.random() * 6,
            day: 20 + Math.random() * 4, night: 13 + Math.random() * 3 },
    weather: [{ icon: icons[i % icons.length], description: 'Partly cloudy', main: 'Clouds' }],
    pop: Math.random() * 0.6, humidity: 55 + Math.floor(Math.random() * 30),
    wind_speed: 3 + Math.random() * 5, clouds: Math.floor(Math.random() * 80), uvi: Math.random() * 7,
  }));
  return {
    lat: 51.5074, lon: -0.1278, timezone: 'Europe/London',
    current: {
      dt: now, sunrise: now - 18000, sunset: now + 10800,
      temp: 22.4, feels_like: 21.2, pressure: 1013, humidity: 65,
      dew_point: 14.8, uvi: 4.5, clouds: 20, visibility: 10000,
      wind_speed: 4.1, wind_deg: 220,
      weather: [{ icon: '01d', description: 'clear sky', main: 'Clear' }],
    },
    hourly, daily,
  };
}

function getMockNews() {
  const n = new Date();
  return [
    { title:'Massive Storm System Expected to Impact Eastern Seaboard This Weekend', url:'https://www.weather.com',
      urlToImage:'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400',
      publishedAt:new Date(n-1800000).toISOString(), source:{name:'Weather News'}, category:'Storm' },
    { title:'Record High Temperatures Sweep Through Southern Europe', url:'https://www.bbc.com/weather',
      urlToImage:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      publishedAt:new Date(n-7200000).toISOString(), source:{name:'Climate Monitor'}, category:'Heat Wave' },
    { title:'Arctic Blast to Bring Bone-Chilling Cold to Northern States', url:'https://weather.gov',
      urlToImage:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400',
      publishedAt:new Date(n-14400000).toISOString(), source:{name:'AccuForecast'}, category:'Cold' },
    { title:'Hurricane Season Forecast: Above-Normal Activity Expected', url:'https://www.nhc.noaa.gov',
      urlToImage:'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400',
      publishedAt:new Date(n-28800000).toISOString(), source:{name:'NOAA'}, category:'Hurricane' },
    { title:'Flash Flood Emergency Declared in Western Texas', url:'https://www.weather.gov/safety/flood',
      urlToImage:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
      publishedAt:new Date(n-43200000).toISOString(), source:{name:'Emergency Weather'}, category:'Flood' },
    { title:'Wildfire Risk Elevated Across California Due to Dry Conditions', url:'https://www.weather.gov/safety/fire',
      urlToImage:'https://images.unsplash.com/photo-1602600849817-0bcc4c25c8e9?w=400',
      publishedAt:new Date(n-57600000).toISOString(), source:{name:'Western Weather'}, category:'Fire' },
    { title:'Spring Tornado Outbreak: Multiple Twisters Touch Down in Tornado Alley', url:'https://www.spc.noaa.gov',
      urlToImage:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      publishedAt:new Date(n-72000000).toISOString(), source:{name:'Storm Tracker'}, category:'Tornado' },
    { title:'AI-Powered Model Achieves 14-Day Forecast Accuracy Milestone', url:'https://www.sciencedaily.com',
      urlToImage:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      publishedAt:new Date(n-86400000).toISOString(), source:{name:'Science Daily'}, category:'Technology' },
    { title:'Climate Change Intensifying Global Weather Patterns, Scientists Warn', url:'https://climate.nasa.gov',
      urlToImage:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400',
      publishedAt:new Date(n-172800000).toISOString(), source:{name:'Nature Climate'}, category:'Climate' },
  ];
}
