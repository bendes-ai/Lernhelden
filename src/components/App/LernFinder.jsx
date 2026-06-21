import React, { useState } from 'react';
import { suggestTechniques } from '../../services/aiService.js';
import { MASTERFAEHIGKEITEN } from '../../data/masterfaehigkeiten.js';

const FAECHER = ['Deutsch','Englisch','Mathe','Geschichte','Biologie','Physik','Geografie','Chemie','Kunst','Musik'];
const AUFGABENTYPEN = [
  { id:'vokabeln', label:'🔤 Vokabeln lernen' }, { id:'fakten', label:'📌 Fakten merken' },
  { id:'prozesse', label:'🔬 Ablauf verstehen' }, { id:'textverstaendnis', label:'📖 Text verstehen' },
  { id:'referat', label:'🎤 Referat vorbereiten' }, { id:'pruefungsvorbereitung', label:'📝 Prüfung üben' }
];
const ZEITEN = [{ id:10, label:'⚡ Unter 15 Min.' }, { id:22, label:'⏱️ 15–30 Min.' }, { id:45, label:'🕐 Über 30 Min.' }];
const PRAEFERENZEN = [
  { id:'visuell', label:'🎨 Visuell (Bilder, Farben)' }, { id:'sprachlich', label:'🗣️ Sprachlich (Lesen, Schreiben)' },
  { id:'kinästhetisch', label:'🤸 Kinästhetisch (Bewegung)' }, { id:'gemeinschaft', label:'👫 Gemeinsam mit anderen' }
];

export default function LernFinder() {
  const [form, setForm] = useState({ fach:'', aufgabentyp:'', zeit:22, praeferenz:'' });
  const [ergebnisse, setErgebnisse] = useState(null);
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    const results = suggestTechniques({ fach:form.fach, aufgabentyp:form.aufgabentyp, zeitMinuten:form.zeit, praeferenz:form.praeferenz });
    setErgebnisse(results);
    setStep(2);
  };

  const reset = () => { setErgebnisse(null); setStep(1); setForm({ fach:'', aufgabentyp:'', zeit:22, praeferenz:'' }); };

  const mfColors = { strukturieren:'#6C63FF', visualisieren:'#FF6584', reduzieren:'#43E97B', spannung:'#FFB347', verknuepfen:'#38BDF8' };

  if (step === 2 && ergebnisse) return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h3 style={{ fontWeight:800 }}>🎯 Deine Technik-Empfehlungen</h3>
        <button className="btn btn-outline" onClick={reset} style={{ fontSize:'0.85rem' }}>← Neu suchen</button>
      </div>
      {ergebnisse.length === 0 ? (
        <p style={{ color:'var(--color-text-light)' }}>Keine Techniken gefunden. Versuche andere Einstellungen!</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {ergebnisse.map((t, i) => {
            const mfs = MASTERFAEHIGKEITEN.filter(mf => t.masterfaehigkeiten.includes(mf.id));
            return (
              <div key={t.id} className="card" style={{ borderLeft:`4px solid ${mfColors[t.masterfaehigkeiten[0]]||'#6C63FF'}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                  <div style={{ fontSize:'2.5rem', background:'#F8F7FF', borderRadius:'12px', padding:'0.5rem', minWidth:'3.5rem', textAlign:'center' }}>{t.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.4rem' }}>
                      <h4 style={{ fontWeight:800 }}>{i+1}. {t.name}</h4>
                      <span style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', color:'white', borderRadius:'50px', padding:'0.15rem 0.75rem', fontSize:'0.8rem', fontWeight:700 }}>
                        Top-Pick
                      </span>
                    </div>
                    <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)', marginBottom:'0.5rem' }}>{t.kurzbeschreibung}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', marginBottom:'0.5rem' }}>
                      {mfs.map(mf => (
                        <span key={mf.id} style={{ background:`${mf.farbe}20`, color:mf.farbe, border:`1px solid ${mf.farbe}40`, borderRadius:'50px', padding:'0.2rem 0.6rem', fontSize:'0.75rem', fontWeight:700 }}>
                          {mf.emoji} {mf.name}
                        </span>
                      ))}
                    </div>
                    <div style={{ background:'#F8F7FF', borderRadius:'8px', padding:'0.6rem 0.8rem', fontSize:'0.85rem' }}>
                      💡 <strong>Tipp:</strong> {t.tipp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontWeight:800, marginBottom:'0.5rem' }}>🎯 Welche Technik passt zu dir?</h2>
      <p style={{ color:'var(--color-text-light)', marginBottom:'1.5rem' }}>Beantworte 4 kurze Fragen – wir finden deine beste Lerntechnik!</p>
      <div className="form-group">
        <label className="form-label">📚 Schulfach</label>
        <select className="form-control" value={form.fach} onChange={e => setForm({...form, fach:e.target.value})}>
          <option value="">Fach wählen...</option>
          {FAECHER.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">📋 Was lernst du?</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.5rem' }}>
          {AUFGABENTYPEN.map(a => (
            <button key={a.id} type="button" className="btn" onClick={() => setForm({...form, aufgabentyp:a.id})}
              style={{ justifyContent:'flex-start', background: form.aufgabentyp===a.id?'linear-gradient(135deg,#6C63FF,#8B5CF6)':'white', color: form.aufgabentyp===a.id?'white':'var(--color-text)', border:'2px solid', borderColor: form.aufgabentyp===a.id?'transparent':'#E5E7EB', borderRadius:'12px', fontSize:'0.9rem' }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">⏱️ Wie viel Zeit hast du?</label>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {ZEITEN.map(z => (
            <button key={z.id} type="button" className="btn" onClick={() => setForm({...form, zeit:z.id})}
              style={{ background: form.zeit===z.id?'linear-gradient(135deg,#6C63FF,#8B5CF6)':'white', color: form.zeit===z.id?'white':'var(--color-text)', border:'2px solid', borderColor: form.zeit===z.id?'transparent':'#E5E7EB', borderRadius:'12px' }}>
              {z.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">🎨 Wie lernst du am liebsten?</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'0.5rem' }}>
          {PRAEFERENZEN.map(p => (
            <button key={p.id} type="button" className="btn" onClick={() => setForm({...form, praeferenz:p.id})}
              style={{ justifyContent:'flex-start', background: form.praeferenz===p.id?'linear-gradient(135deg,#FF6584,#FF8FAB)':'white', color: form.praeferenz===p.id?'white':'var(--color-text)', border:'2px solid', borderColor: form.praeferenz===p.id?'transparent':'#E5E7EB', borderRadius:'12px', fontSize:'0.9rem' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.aufgabentyp}
        style={{ width:'100%', justifyContent:'center', fontSize:'1.1rem', marginTop:'0.5rem' }}>
        🔍 Passende Techniken finden
      </button>
    </div>
  );
}
