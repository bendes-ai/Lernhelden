import React from 'react';
export default function SafetyBanner({ text, emoji = '⚠️' }) {
  return (
    <div className="safety-banner">
      <span style={{ fontSize:'1.25rem' }}>{emoji}</span>
      <p style={{ fontSize:'0.9rem' }}>{text}</p>
    </div>
  );
}
