import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as API from '../utils/api';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp } from '../utils/format';

export default function Header({ units, onSelectCity, onToggleUnits, recentCities, weatherCache }) {
  const [query, setQuery]       = useState('');
  const [suggestions, setSugg]  = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [locating, setLocating] = useState(false);
  const [clock, setClock]       = useState('');
  const timerRef = useRef(null);
  const dropRef  = useRef(null);

  // Live clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Outside click
  useEffect(() => {
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = useCallback((val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (val.length < 2) { setShowDrop(false); setSugg([]); return; }
    timerRef.current = setTimeout(async () => {
      const cities = await API.searchCities(val);
      setSugg(cities);
      setShowDrop(cities.length > 0);
    }, 300);
  }, []);

  const pick = (city) => {
    setQuery(city.name);
    setShowDrop(false);
    setSugg([]);
    onSelectCity(city);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) pick(suggestions[0]);
    if (e.key === 'Escape') setShowDrop(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    const isSecure = window.location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(window.location.hostname);
    if (!isSecure) return alert('Location requires HTTPS.');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const city = await API.getCityFromCoords(coords.latitude, coords.longitude);
          setLocating(false);
          if (city) pick(city);
          else pick({ name:'Your Location', country:'', state:'', lat:coords.latitude, lon:coords.longitude });
        } catch { setLocating(false); }
      },
      (err) => {
        setLocating(false);
        const msgs = { 1:'Location access denied.', 2:'Location unavailable.', 3:'Location timed out.' };
        alert(msgs[err.code] || 'Location error.');
      },
      { enableHighAccuracy:false, timeout:10000, maximumAge:300000 }
    );
  };

  return (
    <header className="hero-section">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[{t:'12%',l:'7%',d:'.4s'},{t:'22%',l:'18%',d:'1s'},{t:'8%',l:'32%',d:'.2s'},
          {t:'18%',l:'48%',d:'1.4s'},{t:'6%',l:'63%',d:'.7s'},{t:'16%',l:'78%',d:'.1s'},
          {t:'10%',l:'91%',d:'1.1s'}].map((s,i)=>(
          <div key={i} className="star" style={{width:'2px',height:'2px',top:s.t,left:s.l,animationDelay:s.d}}/>
        ))}
      </div>

      <div className="relative z-10 max-w-screen-xl xl:max-w-full mx-auto px-4 pt-3 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌤️</span>
            <span className="logo-text fontSize:'2.5rem'">EBubeWeather</span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-white/65 text-sm font-mono hidden sm:block tabular-nums">{clock}</span>
            <button onClick={onToggleUnits} className="nav-link text-sm">
              {units === 'metric' ? '°C / °F' : '°F / °C'}
            </button>
            <button onClick={getLocation} disabled={locating}
              className={`nav-link text-sm ${locating ? 'opacity-60' : ''}`}>
              📍 {locating ? 'Locating…' : 'My Location'}
            </button>
          </div>
        </div>

        {/* Nav + Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          <div className="flex gap-2 shrink-0 flex-wrap">
            <Link to="/hourly"  className="nav-link text-sm">⏱ Hourly</Link>
            <Link to="/daily"   className="nav-link text-sm">📅 Daily</Link>
            <Link to="/ten-day" className="nav-link text-sm">🗓 10-Day</Link>
          </div>
          <div className="flex-1 min-w-0 max-w-lg" ref={dropRef} style={{position:'relative'}}>
            <div className="relative flex items-center search-wrapper">
              <span className="absolute left-4 text-white/50 pointer-events-none">🔍</span>
              <input
                type="text" value={query} onChange={e => handleInput(e.target.value)}
                onKeyDown={handleKeyDown}
               class="search-input w-full pl-11 pr-16 py-3 text-sm"
                placeholder="Search for a city..."
                autoComplete="off"
              />
              <button
  onClick={() => query.length >= 2 && handleInput(query)}
  className="absolute right-2 bg-white/20 hover:bg-white/30 rounded-full p-2 flex items-center justify-center transition-colors"
>
  <img src="/images/search.png" alt="search" className="w-4 h-4" />
</button>
            </div>
            {showDrop && suggestions.length > 0 && (
              <div id="autocomplete-dropdown">
                {suggestions.map((city, i) => (
                  <button key={i} onClick={() => pick(city)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0">
                    <span className="text-gray-300 shrink-0">📍</span>
                    <span className="font-medium text-gray-800 flex-1 truncate">
                      {city.name}
                      <span className="text-gray-400 font-normal text-sm ml-1">
                        {city.state ? `${city.state}, ` : ''}{city.country}
                      </span>
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full shrink-0">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent locations */}
        {recentCities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            {recentCities.slice(0,3).map((city, i) => {
              const key = `${city.lat},${city.lon}`;
              const d = weatherCache[key];
              const temp  = d ? formatTemp(d.current.temp, units) : '--';
              const feels = d ? formatTemp(d.current.feels_like, units) : '--';
              const icon  = d ? WeatherIcons.getIconUrl(d.current.weather[0].icon) : null;
              const grad  = d ? WeatherIcons.getWeatherGradient(d.current.weather[0].icon) : 'linear-gradient(135deg,#667eea,#764ba2)';
              return (
                <div key={i} onClick={() => onSelectCity(city)}
                  className="recent-card relative overflow-hidden rounded-xl cursor-pointer group"
                  style={{background:grad}}>
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/30 group-hover:bg-black/20 transition-all pointer-events-none"/>
                  <div className="relative z-10 p-8 text-white">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-base leading-tight truncate">{city.name}</p>
                        <p className="text-white/65 text-xs">{city.country}</p>
                      </div>
                      {icon ? <img src={icon} alt="" className="w-9 h-9 shrink-0"/> : <span className="text-2xl">🌡️</span>}
                    </div>
                    <p className="text-3xl font-thin mt-2 leading-none">{temp}</p>
                    <p className="text-xs text-white/55 mt-1">RealFeel® {feels}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
