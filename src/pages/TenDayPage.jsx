import React, { useState, useEffect } from 'react';
import { getOneCall } from '../utils/api';
import Storage from '../utils/storage';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatDate, formatTime, speedUnit } from '../utils/format';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({length:10}).map((_,i) => (
        <div key={i} className="h-14 bg-gray-200 rounded-xl"/>
      ))}
    </div>
  );
}

export default function TenDayPage({ units }) {
  const [daily, setDaily]     = useState([]);
  const [cityLabel, setLabel] = useState('Loading location…');
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const city = Storage.getSelectedCity() || { name:'London', country:'GB', lat:51.5074, lon:-0.1278 };
    setLabel([city.name, city.state, city.country].filter(Boolean).join(', '));
    getOneCall(city.lat, city.lon).then(data => {
      setDaily(data.daily || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <main className="max-w-4xl mx-auto px-2 py-4 page-fade-in">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">10-Day Weather Forecast</h1>
        <p className="text-sm text-gray-400 mt-1">{cityLabel}</p>
      </div>

      {loading ? <Skeleton/> : (
        <div className="space-y-2">
          {daily.slice(0, 10).map((day, i) => {
            const iconUrl  = WeatherIcons.getIconUrl(day.weather[0].icon);
            const moonIcon = WeatherIcons.getMoonPhaseIcon(day.moon_phase || 0);
            const moonName = WeatherIcons.getMoonPhaseName(day.moon_phase || 0);
            const uvInfo   = WeatherIcons.getUVIndexLabel(day.uvi || 0);
            const isOpen   = openIdx === i;

            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => toggle(i)} aria-expanded={isOpen}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-gray-800 w-20 sm:w-28 shrink-0">
                    {i === 0 ? 'Today' : formatDate(day.dt)}
                  </span>
                  <img src={iconUrl} alt="" className="w-8 h-8 shrink-0"/>
                  <span className="text-xs text-gray-400 capitalize flex-1 text-left hidden sm:block truncate">{day.weather[0].description}</span>
                  <span className="text-xs text-blue-500 w-10 text-right shrink-0">💧{Math.round((day.pop||0)*100)}%</span>
                  <div className="flex items-center gap-1.5 shrink-0 w-28 justify-end">
                    <span className="text-xs text-gray-300">{formatTemp(day.temp.min, units)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5" style={{minWidth:28}}>
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 w-full"/>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{formatTemp(day.temp.max, units)}</span>
                  </div>
                  <span className="text-gray-300 ml-1 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-50 p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Day panel */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-3">☀️ Daytime</p>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
                          <div><p className="text-xs text-gray-400">High</p><p className="font-bold text-gray-800">{formatTemp(day.temp.max, units)}</p></div>
                          <div><p className="text-xs text-gray-400">Humidity</p><p className="font-bold text-gray-800">{day.humidity}%</p></div>
                          <div>
                            <p className="text-xs text-gray-400">UV Index</p>
                            <p className="font-bold" style={{color:uvInfo.color}}>{Math.round(day.uvi||0)} {uvInfo.label}</p>
                          </div>
                          <div><p className="text-xs text-gray-400">Wind</p><p className="font-bold text-gray-800">{Math.round(day.wind_speed)} {speedUnit(units)}</p></div>
                        </div>
                        <div className="flex gap-3 mt-3 pt-3 border-t border-orange-100 text-xs text-orange-700">
                          <span>🌅 {formatTime(day.sunrise)}</span>
                          <span>🌇 {formatTime(day.sunset)}</span>
                        </div>
                      </div>

                      {/* Night panel */}
                      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">🌙 Night</p>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
                          <div><p className="text-xs text-gray-400">Low</p><p className="font-bold text-gray-800">{formatTemp(day.temp.min, units)}</p></div>
                          <div><p className="text-xs text-gray-400">Cloud Cover</p><p className="font-bold text-gray-800">{day.clouds||0}%</p></div>
                          <div><p className="text-xs text-gray-400">Moon Phase</p><p className="font-bold text-gray-700 text-lg">{moonIcon}</p></div>
                          <div><p className="text-xs text-gray-400">&nbsp;</p><p className="text-xs text-gray-500">{moonName}</p></div>
                        </div>
                        <div className="flex gap-3 mt-3 pt-3 border-t border-indigo-100 text-xs text-indigo-600">
                          <span>🌕 {day.moonrise ? formatTime(day.moonrise) : 'N/A'}</span>
                          <span>🌑 {day.moonset  ? formatTime(day.moonset)  : 'N/A'}</span>
                        </div>
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
