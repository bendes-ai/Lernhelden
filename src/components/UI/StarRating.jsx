import React, { useState } from 'react';
export default function StarRating({ label, value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && <p style={{ fontWeight:700, marginBottom:'0.4rem' }}>{label}</p>}
      <div className="star-rating">
        {Array.from({ length:max }, (_,i) => i+1).map(n => (
          <button key={n} type="button" className={n <= (hover||value) ? 'active' : ''}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange?.(n)}
            style={{ background:'none', border:'none', fontSize:'1.8rem', cursor:'pointer', transition:'transform 0.2s', transform: n<=(hover||value)?'scale(1.2)':'scale(1)' }}>
            {n <= (hover||value) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
}
