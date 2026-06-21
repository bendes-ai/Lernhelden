import React, { useState } from 'react';
import { LERNTECHNIKEN, AUFGABENTYP_TECHNIKEN } from '../data/lerntechniken.js';
import { MASTERFAEHIGKEITEN } from '../data/masterfaehigkeiten.js';

const AUFGABENTYPEN = [
  {id:'alle',label:'🔍 Alle Techniken'},{id:'vokabeln',label:'🔤 Vokabeln'},{id:'fakten',label:'📌 Fakten'},
  {id:'prozesse',label:'🔬 Prozesse'},{id:'textverstaendnis',label:'📖 Texte'},{id:'referat',label:'🎤 Referate'},{id:'pruefungsvorbereitung',label:'📝 Prüfungen'}
];

export default function Lerntechniken() {
  const [filter, setFilter] = useState('alle');
  const [open, setOpen] = useState(null);
  const mfColors = Object.fromEntries(MASTERFAEHIGKEITEN.map(m => [m.id, m.farbe]));
  const mfEmoji = Object.fromEntries(MASTERFAEHIGKEITEN.map(m => [m.id, m.emoji]));

  const visible = filter==='alle' ? LERNTECHNIKEN : LERNTECHNIKEN.filter(t => t.aufgabentypen?.includes(filter));

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem' }}>🧠</div>
          <h1 className="section-title">22 Lerntechniken entdecken</h1>
          <p className="section-subtitle">Für jedes Fach und jeden Lerntyp – mit echten Schulbeispielen.</p>
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2.5rem', justifyContent:'center' }}>
          {AUFGABENTYPEN.map(a => (
            <button key={a.id} className="btn" onClick={() => setFilter(a.id)}
              style={{ background:filter===a.id?'linear-gradient(135deg,#6C63FF,#8B5CF6)':'white', color:filter===a.id?'white':'var(--color-text)', border:'2px solid', borderColor:filter===a.id?'transparent':'#E5E7EB', fontSize:'0.9rem' }}>
              {a.label}
            </button>
          ))}
        </div>

        <div className="grid-cards">
          {visible.map(t => (
            <div key={t.id} className="card" style={{ cursor:'pointer', borderTop:`4px solid ${mfColors[t.masterfaehigkeiten[0]]||'#6C63FF'}` }} onClick={() => setOpen(open===t.id?null:t.id)}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <span style={{ fontSize:'2rem', background:'#F8F7FF', borderRadius:'12px', padding:'0.4rem', minWidth:'2.8rem', textAlign:'center' }}>{t.emoji}</span>
                <div>
                  <h3 style={{ fontWeight:800, marginBottom:'0.3rem', fontSize:'1.05rem' }}>{t.name}</h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.25rem' }}>
                    {t.masterfaehigkeiten.map(mf => (
                      <span key={mf} style={{ background:`${mfColors[mf]}20`, color:mfColors[mf], border:`1px solid ${mfColors[mf]}40`, borderRadius:'50px', padding:'0.15rem 0.5rem', fontSize:'0.7rem', fontWeight:700 }}>
                        {mfEmoji[mf]} {mf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)', marginBottom:'0.75rem' }}>{t.kurzbeschreibung}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.8rem', color:'var(--color-text-light)' }}>⏱️ ab {t.zeitMin} Min. · {t.aufwand==='einfach'?'✅ Einfach':'⚡ Mittel'}</span>
                <span style={{ color:'var(--color-primary)', fontWeight:700, fontSize:'0.85rem' }}>{open===t.id?'▲ Weniger':'▼ Beispiele'}</span>
              </div>
              {open===t.id && (
                <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #F3F4F6' }}>
                  <h4 style={{ fontWeight:800, marginBottom:'0.5rem' }}>📚 Schulbeispiele:</h4>
                  {t.beispielaufgaben?.map((b,i) => <div key={i} style={{ background:'#F8F7FF', borderRadius:'8px', padding:'0.5rem 0.75rem', marginBottom:'0.4rem', fontSize:'0.85rem' }}>→ {b}</div>)}
                  {t.tipp && <div style={{ background:`${mfColors[t.masterfaehigkeiten[0]]}15`, borderLeft:`3px solid ${mfColors[t.masterfaehigkeiten[0]]}`, borderRadius:'0 8px 8px 0', padding:'0.6rem 0.9rem', marginTop:'0.75rem', fontSize:'0.85rem', fontWeight:700 }}>💡 {t.tipp}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
        {visible.length === 0 && <p style={{ textAlign:'center', color:'var(--color-text-light)', marginTop:'2rem' }}>Keine Techniken für diesen Filter gefunden.</p>}
      </div>
    </div>
  );
}
