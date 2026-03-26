import React, { useState, useEffect } from 'react';
import { getOneCall } from '../utils/api';
import Storage from '../utils/storage';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatDate, speedUnit } from '../utils/format';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({length:7}).map((_,i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-xl"/>
      ))}
    </div>
  );
}

export default function DailyPage({ units }) {
  const [daily, setDaily]     = useState([]);
  const [cityLabel, setLabel] = useState('Loading location…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const city = Storage.getSelectedCity() || { name:'London', country:'GB', lat:51.5074, lon:-0.1278 };
    setLabel([city.name, city.state, city.country].filter(Boolean).join(', '));
    getOneCall(city.lat, city.lon).then(data => {
      setDaily(data.daily || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-2 py-4 page-fade-in">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Daily Weather Forecast</h1>
        <p className="text-sm text-gray-400 mt-1">{cityLabel}</p>
      </div>

      {loading ? <Skeleton/> : (
        <div className="space-y-3">
          {daily.slice(0, 7).map((day, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="w-20 sm:w-24 shrink-0">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    {i === 0 ? 'Today' : formatDate(day.dt)}
                  </p>
                </div>
                <img src={WeatherIcons.getIconUrl(day.weather[0].icon)} alt="" className="w-9 h-9 shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 capitalize truncate">{day.weather[0].description}</p>
                  <p className="text-xs text-blue-500">💧 {Math.round((day.pop||0)*100)}% precip</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="text-xs text-gray-300">{formatTemp(day.temp.min, units)}</span>
                  <div className="w-12 sm:w-16 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 w-full"/>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{formatTemp(day.temp.max, units)}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-gray-50 text-center">
                {[
                  ['Humidity', `${day.humidity}%`],
                  ['Wind', `${Math.round(day.wind_speed)} ${speedUnit(units)}`],
                  ['UV', `${Math.round(day.uvi || 0)}`],
                  ['Cloud', `${day.clouds || 0}%`],
                ].map(([label, val], j) => (
                  <div key={j} className={`py-2 px-1 ${j < 3 ? 'border-r border-gray-50' : ''}`}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
