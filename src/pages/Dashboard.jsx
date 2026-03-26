import React from 'react';
import CurrentWeather from '../components/CurrentWeather';
import Analytics from '../components/Analytics';
import TimeOfDay from '../components/TimeOfDay';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import AirQuality from '../components/AirQuality';
import NewsSidebar from '../components/NewsSidebar';
import NewsGrid from '../components/NewsGrid';
import WeatherSkeleton from '../components/WeatherSkeleton';

export default function Dashboard({ weatherData, currentCity, newsData, loading, error, units, onRetry }) {
  return (
    <main className="max-w-screen-xl xl:max-w-full mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT: Weather panels */}
        <div className="flex-1 min-w-0">
          {loading && <WeatherSkeleton/>}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button onClick={onRetry}
                className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                Try London Instead
              </button>
            </div>
          )}
          {!loading && !error && weatherData && (
            <>
              <CurrentWeather data={weatherData} city={currentCity} units={units}/>
              <Analytics       data={weatherData} units={units}/>
              <TimeOfDay       hourly={weatherData.hourly || []} units={units}/>
              <HourlyForecast  hourly={weatherData.hourly || []} units={units}/>
              <DailyForecast   daily={weatherData.daily  || []} units={units}/>
              {weatherData.airQuality && <AirQuality aqData={weatherData.airQuality}/>}
            </>
          )}
        </div>

        {/* RIGHT: News sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
          <NewsSidebar articles={newsData}/>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-bold text-amber-800">Weather Alerts</p>
                <p className="text-xs text-amber-600 mt-1 leading-relaxed">No active weather alerts for your area.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-4">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1.5">⚡ Did You Know?</p>
            <p className="text-sm text-indigo-800 leading-relaxed">
              Lightning strikes the Earth about 100 times every second — roughly 8 million times per day.
            </p>
          </div>
        </div>
      </div>

      <NewsGrid articles={newsData}/>
    </main>
  );
}
