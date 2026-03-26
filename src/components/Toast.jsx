import React, { useState } from 'react';

const COLORS = {
  info:    'bg-blue-500',
  success: 'bg-green-500',
  error:   'bg-red-500',
  warning: 'bg-amber-500',
};

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  return { toasts, show };
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`${COLORS[t.type]} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium max-w-xs
                      transition-all duration-300 animate-fade-in`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
