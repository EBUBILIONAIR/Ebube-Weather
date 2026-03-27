import React from 'react';
import { Link } from 'react-router-dom';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp } from '../utils/format';

const SLOTS = [
  { label: 'Morning',   icon: '🌄', range: [5,  11] },
  { label: 'Afternoon', icon: '☀️', range: [12, 16] },
  { label: 'Evening',   icon: '🌆', range: [17, 20] },
  { label: 'Night',     icon: '🌙', range: [21,  4], isNight: true },
];

export default function TimeOfDay({ hourly, units }) {
  const today = new Date().toDateString();

  const rows = SLOTS.map(slot => {
    const filtered = hourly.filter(h => {
      const hr = new Date(h.dt * 1000).getHours();
      if (slot.isNight) return hr >= 21 || hr <= 4;
      const inToday = new Date(h.dt * 1000).toDateString() === today;
      return inToday && hr >= slot.range[0] && hr <= slot.range[1];
    });
    if (!filtered.length) return null;
    const avgTemp = filtered.reduce((s, h) => s + h.temp, 0) / filtered.length;
    const maxPop  = Math.max(...filtered.map(h => h.pop || 0));
    const iconUrl = WeatherIcons.getIconUrl(filtered[0].weather[0].icon);
    return { ...slot, avgTemp, maxPop, iconUrl, desc: filtered[0].weather[0].description };
  }).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Time of Day</h3>
        <Link to="/hourly" className="text-xs text-blue-500 hover:text-blue-700 font-medium">Next 48 hrs →</Link>
      </div>
      {rows.length === 0
        ? <p className="text-gray-300 text-sm text-center py-4">No data</p>
        : rows.map((row, i) => (
        <div className="flex items-center gap-1 sm:gap-3 py-2.5 border-b border-gray-50 last:border-0 px-2 hover:bg-gray-50 rounded-lg transition-colors">
  <span className="text-base w-5 shrink-0">{row.icon}</span>
  <span className="text-xs sm:text-sm font-medium text-gray-600 w-16 sm:w-20 shrink-0">{row.label}</span>
  <img src={row.iconUrl} alt="" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"/>
  <span className="text-xs text-gray-500 flex-1 capitalize hidden sm:block truncate">{row.desc}</span>
  <span className="text-xs text-blue-500 w-8 sm:w-10 text-right shrink-0">{Math.round(row.maxPop * 100)}%</span>
  <span className="text-xs sm:text-sm font-bold text-gray-800 w-10 sm:w-14 text-right shrink-0">{formatTemp(row.avgTemp, units)}</span>
</div>
        ))
      }
    </div>
  );
}
