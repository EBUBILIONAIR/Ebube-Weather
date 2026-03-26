import React from 'react';
import { Link } from 'react-router-dom';
import WeatherIcons from '../utils/weatherIcons';
import { formatTemp, formatDate } from '../utils/format';

export default function DailyForecast({ daily, units }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Daily Forecast</h3>
        <Link to="/ten-day" className="text-xs text-blue-500 hover:text-blue-700 font-medium">10 Days →</Link>
      </div>
      {daily.slice(0, 5).map((day, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors">
          <span className="text-xs sm:text-sm font-medium text-gray-600 w-20 sm:w-24 shrink-0">
            {i === 0 ? 'Today' : formatDate(day.dt)}
          </span>
          <img src={WeatherIcons.getIconUrl(day.weather[0].icon)} alt="" className="w-8 h-8 shrink-0"/>
          <span className="text-xs text-gray-400 flex-1 capitalize hidden md:block truncate">{day.weather[0].description}</span>
          <span className="text-xs text-blue-500 w-8 text-right shrink-0">{Math.round((day.pop || 0) * 100)}%</span>
          <div className="flex items-center gap-1.5 w-28 sm:w-32 justify-end shrink-0">
            <span className="text-xs text-gray-300">{formatTemp(day.temp.min, units)}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5" style={{ minWidth: 32 }}>
              <div className="bg-gradient-to-r from-blue-400 to-orange-400 h-1.5 rounded-full w-full"/>
            </div>
            <span className="text-sm font-bold text-gray-800">{formatTemp(day.temp.max, units)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
