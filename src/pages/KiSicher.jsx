import React, { useState } from 'react';
import { KI_CONTENT } from '../data/ki-content.js';

export default function KiSicher() {
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const quizFragen = [
    { frage:'Darf ich meinen vollen Namen in eine KI-App eingeben?', antworten:['Ja, kein Problem!','Nein, niemals!','Nur wenn die App kostenlos ist.'], richtig:1, erklaerung:'KI-Apps können Daten speichern. Dein Name gehört dir – gib ihn nicht weiter!' },
    { frage:'Eine KI sagt dir, dass Wale die größten Tiere ALLER ZEITEN sind. Was tust du?', antworten:['Ich glaube es sofort.','Ich prüfe es in einem Buch oder bei einer Lehrkraft nach.','Ich erzähle es allen weiter.'], richtig:1, erklaerung:'KI kann sich irren! Wichtige Infos immer im Lehrbuch oder bei einer Lehrkraft prüfen.' },
    { frage:'Was bedeutet es, wenn KI "halluziniert"?', antworten:['Die KI schläft.','Die KI erfindet Antworten, die falsch sind.','Die KI malt Bilder.'], richtig:1, erklaerung:'KI-Halluzination = KI erfindet plausibel klingende, aber falsche Informationen. Immer skeptisch bleiben!' }
  ];

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem' }}>🤖</div>
          <h1 className="section-title">KI sicher nutzen</h1>
          <p className="section-subtitle">Was ist KI? Was kann sie? Wo sind die Grenzen? Alles kindgerecht erklärt.</p>
        </div>

        <div className="card" style={{ marginBottom:'2rem', borderTop:'4px solid #6C63FF' }}>
          <h2 style={{ fontWeight:800, marginBottom:'1rem' }}>{KI_CONTENT.wasIstKi.titel}</h2>
          <div style={{ background:'linear-gradient(135deg,#F8F7FF,#EEF2FF)', borderRadius:'12px', padding:'1.25rem', marginBottom:'1.25rem', borderLeft:'4px solid #6C63FF' }}>
            <p style={{ fontStyle:'italic', fontSize:'1.05rem' }}>"{KI_CONTENT.wasIstKi.kindErklaerung}"</p>
          </div>
          <div className="grid-2">
            {KI_CONTENT.wasIstKi.beispiele.map(b => (
              <div key={b.name} className="card" style={{ padding:'1rem' }}>
                <span style={{ fontSize:'1.75rem' }}>{b.emoji}</span>
                <h4 style={{ fontWeight:700, margin:'0.4rem 0 0.2rem' }}>{b.name}</h4>
                <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)' }}>{b.beschreibung}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom:'2rem' }}>
          <div className="card" style={{ borderTop:'4px solid #43E97B' }}>
            <h2 style={{ fontWeight:800, marginBottom:'1rem' }}>✅ Was KI kann</h2>
            {KI_CONTENT.vorteile.map(v => (
              <div key={v.titel} style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem', alignItems:'flex-start' }}>
                <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{v.emoji}</span>
                <div><h4 style={{ fontWeight:700, marginBottom:'0.2rem' }}>{v.titel}</h4><p style={{ fontSize:'0.9rem', color:'var(--color-text-light)' }}>{v.text}</p></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ borderTop:'4px solid #FF6584' }}>
            <h2 style={{ fontWeight:800, marginBottom:'1rem' }}>⚠️ Wo KI Grenzen hat</h2>
            {KI_CONTENT.risiken.map(r => (
              <div key={r.titel} style={{ background:`${r.farbe}15`, border:`1px solid ${r.farbe}40`, borderRadius:'12px', padding:'1rem', marginBottom:'0.75rem' }}>
                <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.4rem' }}>
                  <span style={{ fontSize:'1.4rem' }}>{r.emoji}</span>
                  <h4 style={{ fontWeight:700, color:r.farbe }}>{r.titel}</h4>
                </div>
                <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom:'2rem', background:'linear-gradient(135deg,#1A1A2E,#2D2B55)', color:'white' }}>
          <h2 style={{ fontWeight:800, marginBottom:'1.25rem' }}>📋 Meine KI-Regeln – 6 goldene Tipps</h2>
          {KI_CONTENT.verhaltensregeln.map((r,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1rem', background:'rgba(255,255,255,0.08)', borderRadius:'12px', padding:'0.9rem 1.1rem' }}>
              <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{r.emoji}</span>
              <div><span style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50px', padding:'0.1rem 0.6rem', fontSize:'0.7rem', fontWeight:700, marginRight:'0.5rem' }}>{r.kategorie}</span><span style={{ fontSize:'0.95rem' }}>{r.regel}</span></div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontWeight:800, marginBottom:'1rem' }}>🎮 KI-Quiz: Was weißt du schon?</h2>
          {quizAnswer === null ? (
            <div>
              <p style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'1.25rem' }}>{quizFragen[quizIdx].frage}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {quizFragen[quizIdx].antworten.map((a,i) => (
                  <button key={i} className="btn" onClick={() => setQuizAnswer(i)} style={{ justifyContent:'flex-start', background:'white', border:'2px solid #E5E7EB', borderRadius:'12px', textAlign:'left', padding:'0.9rem 1.25rem' }}>
                    {String.fromCharCode(65+i)}) {a}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background: quizAnswer===quizFragen[quizIdx].richtig?'rgba(67,233,123,0.15)':'rgba(255,101,132,0.15)', border:`2px solid ${quizAnswer===quizFragen[quizIdx].richtig?'#43E97B':'#FF6584'}`, borderRadius:'12px', padding:'1.25rem', marginBottom:'1rem', textAlign:'center' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>{quizAnswer===quizFragen[quizIdx].richtig?'🎉':'😊'}</div>
                <p style={{ fontWeight:800, fontSize:'1.1rem' }}>{quizAnswer===quizFragen[quizIdx].richtig?'Richtig!':'Nicht ganz!'}</p>
                <p style={{ fontSize:'0.9rem', marginTop:'0.5rem' }}>{quizFragen[quizIdx].erklaerung}</p>
              </div>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => { setQuizAnswer(null); setQuizIdx((quizIdx+1)%quizFragen.length); }}>
                {quizIdx<quizFragen.length-1?'Nächste Frage →':'Von vorne beginnen 🔁'}
              </button>
            </div>
          )}
          <p style={{ fontSize:'0.8rem', color:'var(--color-text-light)', marginTop:'1rem', textAlign:'center' }}>Frage {quizIdx+1} von {quizFragen.length}</p>
        </div>
      </div>
    </div>
  );
}
