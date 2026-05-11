'use client';
import React, { useState, useEffect, useCallback } from 'react';

let _addToast = null;

export function toast(message, type = 'info') {
  if (_addToast) _addToast(message, type);
}

export function Toast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320);
    }, 3500);
  }, []);

  useEffect(() => { 
    _addToast = addToast; 
    return () => { _addToast = null; }; 
  }, [addToast]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}${t.removing ? ' removing' : ''}`}>
          <span className="toast-icon">{icons[t.type] || icons.info}</span>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>✕</button>
        </div>
      ))}
    </div>
  );
}
