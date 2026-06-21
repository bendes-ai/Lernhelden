import React from 'react';
import { Link } from 'react-router-dom';
import { MASTERFAEHIGKEITEN } from '../data/masterfaehigkeiten.js';

export default function Startseite() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#6C63FF 0%,#8B5CF6 50%,#EC4899 100%)', color:'white', padding:'5rem 0 4rem', textAlign:'center' }}>
        <div className="container">
          <div style={{ fontSize:'5rem', marginBottom:'1rem', animation:'float 3s ease-in-out infinite' }}>🦸</div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, marginBottom:'0.75rem', lineHeight:1.2 }}>Lern schlauer. Nicht härter. 🚀</h1>
          <p style={{ fontSize:'1.2rem', opacity:0.9, maxWidth:600, margin:'0 auto 2rem' }}>Entdecke über 20 Lerntechniken und lerne, KI sicher und clever einzusetzen – für Kinder von 8–14 Jahren.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/lerntechniken" className="btn" style={{ background:'white', color:'#6C63FF', fontSize:'1.05rem' }}>🧠 Lerntechniken entdecken</Link>
            <Link to="/lern-app" className="btn" style={{ background:'rgba(255,255,255,0.2)', color:'white', border:'2px solid rgba(255,255,255,0.5)', fontSize:'1.05rem' }}>🚀 Zur Lern-App</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign:'center' }}>Die 5 MASTERFÄHIGKEITEN des Lernens 🧠</h2>
          <p className="section-subtitle" style={{ textAlign:'center' }}>Alle Lerntechniken bauen auf diesen 5 Superkräften auf:</p>
          <div className="grid-cards">
            {MASTERFAEHIGKEITEN.map(mf => (
              <div key={mf.id} className="card" style={{ borderTop:`4px solid ${mf.farbe}`, textAlign:'center' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem', background:`${mf.farbe}15`, borderRadius:'50%', width:'4rem', height:'4rem', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem' }}>{mf.emoji}</div>
                <h3 style={{ fontWeight:800, marginBottom:'0.5rem', color:mf.farbe }}>{mf.name}</h3>
                <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)' }}>{mf.kindErklaerung}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg,#F8F7FF,#EEF2FF)', padding:'4rem 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign:'center' }}>Was dich erwartet</h2>
          <div className="grid-2" style={{ marginTop:'2rem' }}>
            {[
              {emoji:'🧠',titel:'22 Lerntechniken',text:'Für jeden Lerntyp die passende Methode – erklärt mit echten Schulbeispielen.',link:'/lerntechniken',farbe:'#6C63FF'},
              {emoji:'🚀',titel:'Persönliche Lern-App',text:'Finde deine beste Technik und tracke deinen Fortschritt – ohne Registrierung.',link:'/lern-app',farbe:'#FF6584'},
              {emoji:'🤖',titel:'KI sicher nutzen',text:'Chancen und Risiken von KI verständlich erklärt – für Kinder und Eltern.',link:'/ki-sicher',farbe:'#43E97B'},
              {emoji:'👨‍👩‍👧',titel:'Für Eltern & Lehrkräfte',text:'Tipps zur Begleitung, Hintergrundinformationen und Unterrichtsmaterial.',link:'/fuer-eltern',farbe:'#FFB347'}
            ].map(k => (
              <Link key={k.link} to={k.link} style={{ textDecoration:'none' }}>
                <div className="card" style={{ borderLeft:`4px solid ${k.farbe}`, height:'100%' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{k.emoji}</div>
                  <h3 style={{ fontWeight:800, color:k.farbe, marginBottom:'0.5rem' }}>{k.titel}</h3>
                  <p style={{ color:'var(--color-text-light)', fontSize:'0.95rem' }}>{k.text}</p>
                  <p style={{ color:k.farbe, fontWeight:700, marginTop:'0.75rem', fontSize:'0.9rem' }}>Mehr erfahren →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg,#FFB347,#FF6584)', color:'white', padding:'3rem 0', textAlign:'center' }}>
        <div className="container">
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>⚠️</div>
          <h3 style={{ fontWeight:900, fontSize:'1.3rem', marginBottom:'0.75rem' }}>Wichtiger Datenschutz-Hinweis</h3>
          <p style={{ maxWidth:600, margin:'0 auto', opacity:0.9 }}>Gib auf dieser Website niemals deinen vollen Namen, deine Adresse, Schule oder andere persönliche Daten ein. Lernfortschritte werden nur lokal auf deinem Gerät gespeichert.</p>
        </div>
      </section>
    </div>
  );
}
