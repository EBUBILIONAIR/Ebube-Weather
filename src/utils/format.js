export const formatTemp  = (t, units) => `${Math.round(t)}${units === 'metric' ? '°C' : '°F'}`;
export const formatTime  = (ts) => ts ? new Date(ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--';
export const formatDate  = (ts) => new Date(ts * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
export const formatHour  = (ts) => new Date(ts * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
export const speedUnit   = (units) => units === 'metric' ? 'm/s' : 'mph';
export const timeAgo     = (iso) => {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
