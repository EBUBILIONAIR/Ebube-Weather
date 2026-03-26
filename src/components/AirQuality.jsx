import React from 'react';

const AQI_LABELS = {
  1: { text: 'Good',      color: '#4CAF50' },
  2: { text: 'Fair',      color: '#8BC34A' },
  3: { text: 'Moderate',  color: '#FFC107' },
  4: { text: 'Poor',      color: '#FF5722' },
  5: { text: 'Very Poor', color: '#F44336' },
};

export default function AirQuality({ aqData }) {
  if (!aqData?.list?.[0]) return null;
  const aqi  = aqData.list[0].main.aqi;
  const info = AQI_LABELS[aqi] || AQI_LABELS[3];
  const comp = aqData.list[0].components;
  const pollutants = [
    ['PM2.5', comp.pm2_5], ['PM10', comp.pm10], ['NO₂', comp.no2],
    ['SO₂',  comp.so2],   ['CO',   comp.co],   ['O₃',  comp.o3],
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Air Quality</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
             style={{ background: info.color }}>{aqi}</div>
        <div>
          <p className="font-bold" style={{ color: info.color }}>{info.text}</p>
          <p className="text-xs text-gray-400">Air Quality Index</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
        {pollutants.map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-gray-400 mb-0.5">{k}</p>
            <p className="font-semibold text-gray-700">{v != null ? v.toFixed(1) : '--'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
