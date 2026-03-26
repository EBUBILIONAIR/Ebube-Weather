import React from 'react';

export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="skeleton h-52 rounded-2xl w-full"/>
      <div className="skeleton h-60 rounded-2xl w-full"/>
      <div className="skeleton h-44 rounded-2xl w-full"/>
      <div className="skeleton h-64 rounded-2xl w-full"/>
    </div>
  );
}
