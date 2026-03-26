import React from 'react';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatTime, speedUnit } from '../utils/format';

export default function CurrentWeather({ data, city, units }) {
  const c    = data.current;
  const daily = data.daily?.[0];
  const icon  = WeatherIcons.getIconUrl(c.weather[0].icon);
  const grad  = WeatherIcons.getWeatherGradient(c.weather[0].icon);
  const now   = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  return (
    <div className="current-weather-card relative overflow-hidden rounded-2xl text-white mb-4"
         style={{ background: grad, minHeight: 200 }}>
      <div className="absolute inset-0 bg-black/20 pointer-events-none"/>
      <div className="relative z-10 p-5 sm:p-6">

        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold truncate">{city?.name || 'Unknown'}</h2>
            <p className="text-white/75 text-xs mt-0.5">{[city?.state, city?.country].filter(Boolean).join(', ')}</p>
            <p className="text-white/60 text-xs mt-1 hidden sm:block">{dateStr}</p>
            <p className="text-white/60 text-xs">{timeStr}</p>
          </div>
          <img src={icon} alt={c.weather[0].description} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-lg"/>
        </div>

        <div className="flex flex-wrap items-end gap-3 mt-2">
          <div className="text-6xl sm:text-7xl font-thin leading-none">{formatTemp(c.temp, units)}</div>
          <div className="pb-1">
            <p className="text-lg sm:text-xl capitalize font-medium leading-tight">{c.weather[0].description}</p>
            <p className="text-white/75 text-sm">Feels like {formatTemp(c.feels_like, units)}</p>
            {daily && <p className="text-white/65 text-sm">H: {formatTemp(daily.temp.max, units)} · L: {formatTemp(daily.temp.min, units)}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-5 mt-4 pt-3 border-t border-white/20 text-xs sm:text-sm">
          <span className="flex items-center gap-1">🌅 {formatTime(c.sunrise)}</span>
          <span className="flex items-center gap-1">🌇 {formatTime(c.sunset)}</span>
          <span className="flex items-center gap-1">💧 {c.humidity}%</span>
          <span className="flex items-center gap-1">💨 {Math.round(c.wind_speed)} {speedUnit(units)}</span>
        </div>
      </div>
    </div>
  );
}
