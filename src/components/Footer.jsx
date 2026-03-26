import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-section mt-14 text-gray-400">
      <div className="max-w-screen-xl xl:max-w-full px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">

          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌤️</span>
              <span className="logo-text text-base">EBubeWeather</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The world's most accurate weather forecasts, wherever you are.
            </p>
           <div className="flex gap-2 flex-wrap">
  {[
  { img: '/images/twitter.png',   hover: 'hover:bg-blue-600' },
  { img: '/images/facebook.png',  hover: 'hover:bg-blue-700' },
  { img: '/images/instagram.png', hover: 'hover:bg-pink-600' },
  { img: '/images/youtube.png',   hover: 'hover:bg-red-600'  },
].map((item, i) => (
  <div key={i}
     className={`w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center ${item.hover} transition-colors overflow-hidden cursor-pointer`}>
    <img src={item.img} alt="" className="w-7 h-7 object-cover"/>
  </div>
))}
</div>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Products</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/hourly"  className="hover:text-white transition-colors">Hourly Forecast</Link></li>
              <li><Link to="/daily"   className="hover:text-white transition-colors">Daily Forecast</Link></li>
              <li><Link to="/ten-day" className="hover:text-white transition-colors">10-Day Forecast</Link></li>
            
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Subscriptions</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Premium</li>
              <li>Business</li>
              <li>API Access</li>
              <li>Enterprise</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
               <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Settings</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-gray-600">
          <p>© 2026 Weather Dashboard. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/terms"   className="hover:text-gray-300 transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <div className="hover:text-gray-300 transition-colors">Cookie Policy</div>
            <div className="hover:text-gray-300 transition-colors">Ad Choices</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
