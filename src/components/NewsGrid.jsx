import React from 'react';
import { timeAgo } from '../utils/format';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="skeleton h-40 w-full rounded-none"/>
      <div className="p-4 space-y-2">
        <div className="skeleton h-2.5 w-20 rounded"/>
        <div className="skeleton h-3.5 w-full rounded"/>
        <div className="skeleton h-3.5 w-4/5 rounded"/>
        <div className="skeleton h-2.5 w-24 rounded"/>
      </div>
    </div>
  );
}

export default function NewsGrid({ articles }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Weather News</h2>
        <span className="text-xs text-gray-400 uppercase tracking-wide">Updated hourly</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length === 0
          ? [1,2,3,4,5,6].map(i => <SkeletonCard key={i}/>)
          : articles.slice(0, 9).map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
               className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group block">
              <div className="overflow-hidden h-40 bg-gradient-to-br from-blue-400 to-indigo-500">
                {a.urlToImage
                  ? <img src={a.urlToImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         onError={e => { e.target.parentElement.innerHTML = '<div class="h-full flex items-center justify-center text-4xl">🌦️</div>'; }}/>
                  : <div className="h-full flex items-center justify-center text-4xl">🌦️</div>
                }
              </div>
              <div className="p-4">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2 bg-blue-50 text-blue-500">
                  {a.category || a.source?.name || 'Weather'}
                </span>
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug mb-2">{a.title}</h4>
                <p className="text-xs text-gray-300">{timeAgo(a.publishedAt)}</p>
              </div>
            </a>
          ))
        }
      </div>
    </section>
  );
}
