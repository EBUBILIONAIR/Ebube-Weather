import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWeather } from './hooks/useWeather';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer, { useToast } from './components/Toast';
import Dashboard from './pages/Dashboard';
import HourlyPage from './pages/HourlyPage';
import DailyPage from './pages/DailyPage';
import TenDayPage from './pages/TenDayPage';
import { PrivacyPage, TermsPage } from './pages/StaticPages';
import ScrollToTop from './components/ScrollToTop';

function AppInner() {
  const { toasts, show: showToast } = useToast();
  const {
    weatherData, currentCity, recentCities, newsData,
    loading, error, units, weatherCache,
    selectCity, toggleUnits,
  } = useWeather();

  const handleSelectCity = async (city) => {
    showToast(`Loading weather for ${city.name}...`, 'info');
    await selectCity(city);
    showToast(`Weather updated for ${city.name}`, 'success');
  };

  const handleRetry = () => {
    selectCity({ name:'London', country:'GB', state:'England', lat:51.5074, lon:-0.1278 });
  };

  const SharedHeader = () => (
    <Header
      units={units}
      onSelectCity={handleSelectCity}
      onToggleUnits={toggleUnits}
      recentCities={recentCities}
      weatherCache={weatherCache}
    />
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={
          <>
            <SharedHeader/>
            <Dashboard
              weatherData={weatherData} currentCity={currentCity}
              newsData={newsData} loading={loading} error={error}
              units={units} onRetry={handleRetry}
            />
            <Footer/>
          </>
        }/>
        <Route path="/hourly"  element={<><SharedHeader/><HourlyPage  units={units}/><Footer/></>}/>
        <Route path="/daily"   element={<><SharedHeader/><DailyPage   units={units}/><Footer/></>}/>
        <Route path="/ten-day" element={<><SharedHeader/><TenDayPage  units={units}/><Footer/></>}/>
        <Route path="/privacy" element={<><SharedHeader/><PrivacyPage/><Footer/></>}/>
        <Route path="/terms"   element={<><SharedHeader/><TermsPage/><Footer/></>}/>
      </Routes>
      <ToastContainer toasts={toasts}/>
    </div>
  );
}

export default function App() {
  return (
  <BrowserRouter>
   <ScrollToTop />
  <AppInner/>
  </BrowserRouter>
  );
}
