import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path:'/', label:'🏠 Start' },
  { path:'/lerntechniken', label:'🧠 Lerntechniken' },
  { path:'/lern-app', label:'🚀 Lern-App' },
  { path:'/ki-sicher', label:'🤖 KI sicher' },
  { path:'/fuer-eltern', label:'👨‍👩‍👧 Für Eltern' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <header style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', boxShadow:'0 4px 20px rgba(108,99,255,0.3)', position:'sticky', top:0, zIndex:100 }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 1.5rem' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <span style={{ fontSize:'2rem' }}>🦸</span>
          <div>
            <div style={{ color:'white', fontWeight:900, fontSize:'1.3rem', lineHeight:1 }}>LernHeld</div>
            <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.7rem' }}>Clever lernen & KI sicher nutzen</div>
          </div>
        </Link>
        <nav style={{ display:'flex', gap:'0.25rem' }} className="hide-mobile">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} style={{ color: loc.pathname===n.path?'white':'rgba(255,255,255,0.8)', textDecoration:'none', padding:'0.5rem 0.9rem', borderRadius:'50px', fontSize:'0.9rem', fontWeight:700, background: loc.pathname===n.path?'rgba(255,255,255,0.2)':'transparent', transition:'all 0.2s' }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} style={{ display:'none', background:'none', border:'none', color:'white', fontSize:'1.8rem', cursor:'pointer' }} className="burger-btn">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div style={{ background:'rgba(255,255,255,0.1)', padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {NAV.map(n => (
            <Link key={n.path} to={n.path} onClick={() => setOpen(false)} style={{ color:'white', textDecoration:'none', padding:'0.75rem 1rem', borderRadius:'12px', fontWeight:700, background: loc.pathname===n.path?'rgba(255,255,255,0.2)':'transparent' }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.hide-mobile{display:none!important}.burger-btn{display:block!important}}`}</style>
    </header>
  );
}
