const WeatherIcons = {
  getIconUrl: (code) => `https://openweathermap.org/img/wn/${code}@2x.png`,

  getWeatherGradient(code) {
    const g = {
      '01d':'linear-gradient(135deg,#FF8C00,#FF6B35 30%,#FF4500 60%,#FF8C00)',
      '01n':'linear-gradient(135deg,#0F0C29,#302B63 50%,#24243E)',
      '02d':'linear-gradient(135deg,#56CCF2,#2F80ED)',
      '02n':'linear-gradient(135deg,#1a1a2e,#16213e 50%,#0f3460)',
      '03d':'linear-gradient(135deg,#636FA4,#E8CBC0)',
      '03n':'linear-gradient(135deg,#2C3E50,#4CA1AF)',
      '04d':'linear-gradient(135deg,#757F9A,#D7DDE8)',
      '04n':'linear-gradient(135deg,#1F1C2C,#928DAB)',
      '09d':'linear-gradient(135deg,#4B79A1,#283E51)',
      '09n':'linear-gradient(135deg,#0F2027,#203A43 50%,#2C5364)',
      '10d':'linear-gradient(135deg,#4B79A1,#283E51)',
      '10n':'linear-gradient(135deg,#0F2027,#203A43 50%,#2C5364)',
      '11d':'linear-gradient(135deg,#232526,#414345)',
      '11n':'linear-gradient(135deg,#0a0a0a,#1a0533)',
      '13d':'linear-gradient(135deg,#E0EAFC,#CFDEF3)',
      '13n':'linear-gradient(135deg,#A8C0FF,#3F2B96)',
      '50d':'linear-gradient(135deg,#B2FEFA,#0ED2F7)',
      '50n':'linear-gradient(135deg,#606c88,#3f4c6b)',
    };
    return g[code] || 'linear-gradient(135deg,#667eea,#764ba2)';
  },

  getUVIndexLabel(uvi) {
    if (uvi <= 2) return { label: 'Low', color: '#4CAF50' };
    if (uvi <= 5) return { label: 'Moderate', color: '#FFB300' };
    if (uvi <= 7) return { label: 'High', color: '#FF7043' };
    if (uvi <= 10) return { label: 'Very High', color: '#E53935' };
    return { label: 'Extreme', color: '#8E24AA' };
  },

  getWindDirection(deg) {
    const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return d[Math.round(deg / 22.5) % 16];
  },

  getMoonPhaseIcon(p) {
    if (p === 0 || p === 1) return '🌑';
    if (p < 0.25) return '🌒';
    if (p === 0.25) return '🌓';
    if (p < 0.5) return '🌔';
    if (p === 0.5) return '🌕';
    if (p < 0.75) return '🌖';
    if (p === 0.75) return '🌗';
    return '🌘';
  },

  getMoonPhaseName(p) {
    if (p === 0 || p === 1) return 'New Moon';
    if (p < 0.25) return 'Waxing Crescent';
    if (p === 0.25) return 'First Quarter';
    if (p < 0.5) return 'Waxing Gibbous';
    if (p === 0.5) return 'Full Moon';
    if (p < 0.75) return 'Waning Gibbous';
    if (p === 0.75) return 'Last Quarter';
    return 'Waning Crescent';
  },
};

export default WeatherIcons;
