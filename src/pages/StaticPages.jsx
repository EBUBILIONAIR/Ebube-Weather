import React from 'react';

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function PrivacyPage() {
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-2 py-4 page-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6 text-gray-700 leading-relaxed">
        <Section title="1. Information We Collect">
          <p className="text-sm">We collect information you provide directly to us, including location data (city searches), device information, and usage patterns to improve our forecasting services.</p>
        </Section>
        <Section title="2. How We Use Your Information">
          <p className="text-sm mb-2">We use the information we collect to:</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
            <li>Provide accurate, location-based weather forecasts</li>
            <li>Personalize your weather dashboard experience</li>
            <li>Send weather alerts and notifications you've requested</li>
            <li>Improve our weather prediction algorithms</li>
            <li>Analyze usage patterns to enhance our services</li>
          </ul>
        </Section>
        <Section title="3. Location Data">
          <p className="text-sm">When you search for a city or use the "My Location" feature, we process geographic data solely to retrieve weather information. Location searches are stored locally in your browser via localStorage and are not transmitted to our servers.</p>
        </Section>
        <Section title="4. Cookies and Local Storage">
          <p className="text-sm">We use browser localStorage to save your preferences including selected city, recent locations, and display settings. This data never leaves your device.</p>
        </Section>
        <Section title="5. Third-Party Services">
          <p className="text-sm">Our dashboard uses the OpenWeather API for meteorological data and the News API for weather-related news content. These services have their own privacy policies.</p>
        </Section>
        <Section title="6. Data Retention">
          <p className="text-sm">Weather data cached in your browser expires after 10 minutes. Preference data is stored indefinitely until you clear your browser data.</p>
        </Section>
        <Section title="7. Your Rights">
          <p className="text-sm">You have the right to access, update, or delete any personal information we hold. You can clear all locally stored data by clearing your browser's localStorage.</p>
        </Section>
        <Section title="8. Contact">
          <p className="text-sm">For privacy-related questions, please contact our privacy team at privacy@weatherdashboard.example.com</p>
        </Section>
      </div>
    </main>
  );
}

export function TermsPage() {
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 py-10 page-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Effective: January 1, 2026</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6 text-gray-700 leading-relaxed">
        <Section title="1. Acceptance of Terms">
          <p className="text-sm">By accessing or using the Weather Dashboard service, you agree to be bound by these Terms of Use.</p>
        </Section>
        <Section title="2. Service Description">
          <p className="text-sm">Weather Dashboard provides meteorological data, weather forecasts, and related news content for informational purposes only. Weather predictions are inherently uncertain and should not be relied upon for safety-critical decisions.</p>
        </Section>
        <Section title="3. Accuracy Disclaimer">
          <p className="text-sm">While we strive to provide accurate weather information, forecasts are probabilistic in nature. We make no warranties about the accuracy or completeness of weather data. Always consult official weather services for emergency situations.</p>
        </Section>
        <Section title="4. Permitted Use">
          <p className="text-sm mb-2">You may use this service for personal, non-commercial weather information, planning activities, and educational purposes. You may not scrape, redistribute, or resell weather data obtained through this service.</p>
        </Section>
        <Section title="5. API Usage">
          <p className="text-sm">This dashboard uses the OpenWeather API and News API under their respective license agreements.</p>
        </Section>
        <Section title="6. Limitation of Liability">
          <p className="text-sm">Weather Dashboard shall not be liable for any damages arising from the use or inability to use our service, including damages caused by reliance on weather forecast data.</p>
        </Section>
        <Section title="7. Changes to Terms">
          <p className="text-sm">We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </Section>
        <Section title="8. Contact">
          <p className="text-sm">For questions regarding these terms, contact us at legal@weatherdashboard.example.com</p>
        </Section>
      </div>
    </main>
  );
}
