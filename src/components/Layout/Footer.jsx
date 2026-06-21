import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer style={{ background:'linear-gradient(135deg,#1A1A2E,#2D2B55)', color:'rgba(255,255,255,0.8)', padding:'2.5rem 0 1.5rem' }}>
      <div className="container">
        <div className="grid-2" style={{ marginBottom:'2rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <span style={{ fontSize:'1.75rem' }}>🦸</span>
              <span style={{ fontWeight:900, fontSize:'1.2rem', color:'white' }}>LernHeld</span>
            </div>
            <p style={{ fontSize:'0.9rem', lineHeight:1.7, maxWidth:300 }}>
              Kostenlose Lernplattform für Kinder von 8–14 Jahren. Keine Werbung, keine persönlichen Daten.
            </p>
          </div>
          <div>
            <h4 style={{ color:'white', marginBottom:'0.75rem', fontWeight:800 }}>Seiten</h4>
            {[['/lerntechniken','🧠 Lerntechniken'],['/lern-app','🚀 Lern-App'],['/ki-sicher','🤖 KI sicher'],['/fuer-eltern','👨‍👩‍👧 Für Eltern']].map(([p,l]) => (
              <div key={p}><Link to={p} style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:'0.9rem', display:'block', marginBottom:'0.3rem' }}>{l}</Link></div>
            ))}
          </div>
        </div>
        <div className="safety-banner" style={{ marginBottom:'1.5rem', background:'rgba(255,179,71,0.15)', borderColor:'#FFB347' }}>
          <span style={{ fontSize:'1.25rem' }}>⚠️</span>
          <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.9)' }}>
            <strong>Wichtig:</strong> KI-Vorschläge sind Unterstützungsangebote. Bitte gib keine persönlichen Daten ein.
          </p>
        </div>
        <div style={{ textAlign:'center', fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1rem' }}>
          © 2025 LernHeld • Keine Cookies, keine Tracker, keine persönlichen Daten
        </div>
      </div>
    </footer>
  );
}
