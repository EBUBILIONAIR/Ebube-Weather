import React from 'react';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatTime, speedUnit } from '../utils/format';

export default function Analytics({ data, units }) {
  const c     = data.current;
  const daily = data.daily?.[0];
  const uvInfo   = WeatherIcons.getUVIndexLabel(c.uvi || 0);
  const windDir  = WeatherIcons.getWindDirection(c.wind_deg || 0);
  const dewPoint = c.dew_point ?? (c.temp - ((100 - c.humidity) / 5));

  const nowTs    = Date.now() / 1000;
  const totalDay = c.sunset - c.sunrise;
  const elapsed  = Math.max(0, Math.min(nowTs - c.sunrise, totalDay));
  const pct      = totalDay > 0 ? (elapsed / totalDay) * 100 : 50;
  const sunX     = 10 + 280 * pct / 100;
  const sunY     = 55 - 50 * Math.sin(Math.PI * pct / 100);

  const metrics = [
    { icon:'🌡️', label:'Feels Like',  value: formatTemp(c.feels_like, units) },
    { icon:'📊', label:'High / Low',  value: daily ? `${formatTemp(daily.temp.max, units)} / ${formatTemp(daily.temp.min, units)}` : '--' },
    { icon:'💧', label:'Humidity',    value: `${c.humidity}%` },
    { icon:'🔵', label:'Pressure',    value: `${c.pressure} hPa` },
    { icon:'👁️', label:'Visibility',  value: c.visibility ? `${(c.visibility/1000).toFixed(1)} km` : '--' },
    { icon:'💨', label:'Wind',        value: `${Math.round(c.wind_speed)} ${speedUnit(units)} ${windDir}` },
    { icon:'🌿', label:'Dew Point',   value: formatTemp(dewPoint, units) },
    { icon:'☀️', label:'UV Index',    value: null, uvInfo },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Today's Overview</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        {metrics.map((m, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
            <div className="text-lg mb-1">{m.icon}</div>
            <div className="text-xs text-gray-400 mb-0.5 leading-tight">{m.label}</div>
            {m.uvInfo ? (
              <div className="text-sm font-semibold leading-snug" style={{ color: m.uvInfo.color }}>
                {Math.round(c.uvi || 0)} {m.uvInfo.label}
              </div>
            ) : (
              <div className="text-sm font-semibold text-gray-800 leading-snug">{m.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Sun arc */}
      <div className="bg-gradient-to-b from-sky-50 to-orange-50 rounded-xl p-3 sm:p-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>🌅 {formatTime(c.sunrise)}</span>
          <span className="font-medium text-gray-500 hidden sm:block">Daylight Arc</span>
          <span>🌇 {formatTime(c.sunset)}</span>
        </div>
        <div className="relative h-14">
          <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
            <path d="M 10 55 Q 150 5 290 55" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5"/>
            <path d="M 10 55 Q 150 5 290 55" fill="none" stroke="#F59E0B" strokeWidth="2.5"
                  strokeDasharray={`${pct * 2.82},1000`} strokeLinecap="round"/>
            {pct > 1 && pct < 99 && (
              <circle cx={sunX} cy={sunY} r="5" fill="#F59E0B" opacity="0.9"/>
            )}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Dawn</span>
          <span className="text-amber-500 font-medium">{Math.round(pct)}% through the day</span>
          <span>Dusk</span>
        </div>
      </div>
    </div>
  );
}
