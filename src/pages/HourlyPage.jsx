import React, { useState, useEffect } from 'react';
import { getOneCall } from '../utils/api';
import Storage from '../utils/storage';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatHour, speedUnit } from '../utils/format';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({length:8}).map((_,i) => (
        <div key={i} className="h-14 bg-gray-200 rounded-xl"/>
      ))}
    </div>
  );
}

export default function HourlyPage({ units }) {
  const [hourly, setHourly]   = useState([]);
  const [cityLabel, setLabel] = useState('Loading location…');
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const city = Storage.getSelectedCity() || { name:'London', country:'GB', lat:51.5074, lon:-0.1278 };
    setLabel([city.name, city.state, city.country].filter(Boolean).join(', '));
    getOneCall(city.lat, city.lon).then(data => {
      setHourly(data.hourly || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <main className="max-w-screen-xl mx-auto px-2 py-4 page-fade-in">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hourly Weather Forecast</h1>
        <p className="text-sm text-gray-400 mt-1">{cityLabel}</p>
      </div>

      {loading ? <Skeleton/> : (
        <div className="space-y-2">
          {hourly.slice(0, 48).map((h, i) => {
            const iconUrl  = WeatherIcons.getIconUrl(h.weather[0].icon);
            const uvInfo   = WeatherIcons.getUVIndexLabel(h.uvi || 0);
            const windDir  = WeatherIcons.getWindDirection(h.wind_deg || 0);
            const isOpen   = openIdx === i;

            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => toggle(i)} aria-expanded={isOpen}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 w-16 sm:w-24 shrink-0">
                    {i === 0 ? 'Now' : formatHour(h.dt)}
                  </span>
                  <span className="text-sm font-bold text-gray-800 w-14 shrink-0">{formatTemp(h.temp, units)}</span>
                  <img src={iconUrl} alt="" className="w-8 h-8 shrink-0"/>
                  <span className="text-xs text-gray-400 capitalize flex-1 text-left hidden sm:block truncate">{h.weather[0].description}</span>
                  <span className="text-xs text-blue-500 w-10 text-right shrink-0">💧{Math.round((h.pop||0)*100)}%</span>
                  <span className="text-xs text-gray-300 hidden md:block w-20 text-right shrink-0">
                    💨{Math.round(h.wind_speed)} {speedUnit(units)}
                  </span>
                  <span className="text-gray-300 ml-1 shrink-0 text-xs">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-3 sm:px-4 pb-4 border-t border-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3">
                      {[
                        ['Feels Like', formatTemp(h.feels_like, units)],
                        ['Wind', `${Math.round(h.wind_speed)} ${speedUnit(units)}\n${windDir}`],
                        ['Humidity', `${h.humidity}%`],
                        ['Cloud Cover', `${h.clouds?.all || 0}%`],
                        ['Rain Chance', `${Math.round((h.pop||0)*100)}%`],
                      ].map(([label, val], j) => (
                        <div key={j} className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-400 mb-1">{label}</p>
                          <p className="font-bold text-gray-700 text-sm whitespace-pre-line">{val}</p>
                        </div>
                      ))}
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">UV Index</p>
                        <p className="font-bold text-sm" style={{ color: uvInfo.color }}>
                          {Math.round(h.uvi || 0)} {uvInfo.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
