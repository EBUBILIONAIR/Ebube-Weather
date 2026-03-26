import React from 'react';
import { timeAgo } from '../utils/format';

function SkeletonItem() {
  return (
    <div className="p-4 animate-pulse flex gap-3">
      <div className="skeleton w-16 h-14 rounded-lg shrink-0"/>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-2.5 w-16 rounded"/>
        <div className="skeleton h-3 w-full rounded"/>
        <div className="skeleton h-3 w-3/4 rounded"/>
      </div>
    </div>
  );
}

export default function NewsSidebar({ articles }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Weather News</h3>
        <span className="text-xs text-gray-300">Latest</span>
      </div>
      <div className="divide-y divide-gray-50">
        {articles.length === 0
          ? [1,2,3].map(i => <SkeletonItem key={i}/>)
          : articles.slice(0, 5).map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
               className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0 block">
              {a.urlToImage && (
                <img src={a.urlToImage} alt="" className="w-16 h-14 rounded-lg object-cover shrink-0"
                     onError={e => { e.target.style.display = 'none'; }}/>
              )}
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 bg-blue-50 text-blue-500">
                  {a.category || a.source?.name || 'Weather'}
                </span>
                <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{a.title}</p>
                <p className="text-xs text-gray-300 mt-1">{timeAgo(a.publishedAt)}</p>
              </div>
            </a>
          ))
        }
      </div>
    </div>
  );
}
