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
  <div className="overflow-x-auto -mx-1">
    <table className="w-full text-sm" style={{ minWidth: 400 }}>
      <thead>
        <tr className="text-xs text-gray-300 border-b border-gray-50">
          <th className="text-left pb-2 pl-2 font-medium">Day</th>
          <th className="pb-2 font-medium text-center">Sky</th>
          <th className="pb-2 font-medium text-left hidden sm:table-cell">Condition</th>
          <th className="pb-2 font-medium text-center">Rain</th>
          <th className="pb-2 font-medium text-right pr-2">High / Low</th>
        </tr>
      </thead>
      <tbody>
        {daily.slice(0, 5).map((day, i) => (
          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors">
            <td className="py-2 pl-2 text-gray-500 font-medium text-xs sm:text-sm">
              {i === 0 ? 'Today' : formatDate(day.dt)}
            </td>
            <td className="py-2 text-center">
              <img src={WeatherIcons.getIconUrl(day.weather[0].icon)} alt="" className="w-8 h-8 mx-auto"/>
            </td>
            <td className="py-2 text-gray-400 capitalize text-xs hidden sm:table-cell">
              {day.weather[0].description}
            </td>
            <td className="py-2 text-center text-blue-500 text-xs">
              {Math.round((day.pop || 0) * 100)}%
            </td>
            <td className="py-2 text-right pr-2">
              <span className="font-bold text-gray-800 text-sm">{formatTemp(day.temp.max, units)}</span>
              <span className="text-gray-300 text-xs ml-1">/ {formatTemp(day.temp.min, units)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}
