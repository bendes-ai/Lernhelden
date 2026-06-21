import React, { useState } from 'react';
const TYPE_LABELS = { vocabulary:{label:'Vokabeln',emoji:'🔤',color:'#6C63FF'}, fact:{label:'Fakten',emoji:'📌',color:'#FF6584'}, step:{label:'Schritte',emoji:'🪜',color:'#43E97B'}, concept:{label:'Konzepte',emoji:'💡',color:'#FFB347'} };
const MAT_LABELS = { vocabulary:'Vokabelliste', facts:'Faktenliste', process:'Prozessablauf', text_comprehension:'Lesetext', mixed:'Gemischter Inhalt' };
const DIFF_COLORS = { easy:'#43E97B', medium:'#FFB347', hard:'#FF6584' };

export default function OcrResultPanel({ analysis, onSelectTechnique }) {
  const [tab, setTab] = useState('overview');
  if (!analysis) return null;
  const { materialType, difficulty, itemCount, extractedItems, keywords, suggestedTechniqueIds } = analysis;
  const grouped = extractedItems.reduce((a,i) => { if(!a[i.type])a[i.type]=[]; a[i.type].push(i); return a; }, {});
  const tabs = ['overview', ...Object.keys(grouped)];

  return (
    <div>
      <div className="safety-banner" style={{ marginBottom:'1.5rem' }}>
        <span style={{ fontSize:'1.25rem' }}>⚠️</span>
        <p style={{ fontSize:'0.85rem' }}><strong>KI-Hinweis:</strong> Diese Analyse ist ein Vorschlag. Prüfe die Inhalte, bevor du damit lernst!</p>
      </div>
      <div className="card" style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', color:'white', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div><div style={{ fontSize:'0.85rem', opacity:0.8 }}>Erkannter Typ</div><div style={{ fontSize:'1.4rem', fontWeight:900 }}>{MAT_LABELS[materialType]||materialType}</div></div>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'1.8rem', fontWeight:900 }}>{itemCount}</div><div style={{ fontSize:'0.75rem', opacity:0.8 }}>Einheiten</div></div>
            <div style={{ textAlign:'center' }}>
              <div style={{ background:DIFF_COLORS[difficulty], color:'#1A1A2E', borderRadius:'50px', padding:'0.2rem 0.8rem', fontWeight:700, fontSize:'0.85rem' }}>{{easy:'Einfach',medium:'Mittel',hard:'Schwer'}[difficulty]}</div>
              <div style={{ fontSize:'0.75rem', opacity:0.8, marginTop:'0.2rem' }}>Schwierigkeit</div>
            </div>
          </div>
        </div>
        {keywords?.length > 0 && (
          <div style={{ marginTop:'1rem', display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
            {keywords.map(k => <span key={k} style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50px', padding:'0.2rem 0.6rem', fontSize:'0.8rem' }}>#{k}</span>)}
          </div>
        )}
      </div>
      <div style={{ display:'flex', gap:'0.25rem', marginBottom:'1.25rem', background:'#F3F4F6', borderRadius:'12px', padding:'4px', overflowX:'auto' }}>
        {tabs.map(t => <button key={t} className="btn" onClick={() => setTab(t)} style={{ whiteSpace:'nowrap', padding:'0.5rem 0.9rem', borderRadius:'10px', background:tab===t?'white':'transparent', color:tab===t?'var(--color-primary)':'var(--color-text-light)', fontSize:'0.85rem', fontWeight:700, boxShadow:tab===t?'0 2px 6px rgba(0,0,0,0.1)':'none' }}>
          {t==='overview'?'📋 Übersicht':`${TYPE_LABELS[t]?.emoji||'📄'} ${TYPE_LABELS[t]?.label||t}`}
        </button>)}
      </div>
      {tab==='overview' && (
        <div className="grid-2">
          {Object.entries(grouped).map(([type,items]) => {
            const m = TYPE_LABELS[type]||{label:type,emoji:'📄',color:'#6C63FF'};
            return (
              <div key={type} className="card" style={{ borderLeft:`4px solid ${m.color}` }}>
                <h4 style={{ fontWeight:800, marginBottom:'0.75rem' }}>{m.emoji} {m.label} ({items.length})</h4>
                {items.slice(0,3).map((i,idx) => <div key={idx} style={{ padding:'0.5rem', background:'#F8F7FF', borderRadius:'8px', marginBottom:'0.4rem', fontSize:'0.85rem' }}>
                  <strong>{i.front}</strong>{i.back&&<span style={{ color:'var(--color-text-light)' }}> → {i.back}</span>}
                </div>)}
                {items.length>3 && <p style={{ fontSize:'0.8rem', color:'var(--color-text-light)', marginTop:'0.4rem' }}>+ {items.length-3} weitere…</p>}
              </div>
            );
          })}
        </div>
      )}
      {tab!=='overview' && grouped[tab] && (
        <div>
          {tab==='vocabulary' && (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#F8F7FF' }}>{['#','Wort','Bedeutung','Tipp'].map(h=><th key={h} style={{ padding:'0.75rem', textAlign:'left', fontWeight:800, fontSize:'0.9rem' }}>{h}</th>)}</tr></thead>
                <tbody>{grouped[tab].map((i,idx)=><tr key={idx} style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'0.75rem', color:'var(--color-text-light)' }}>{idx+1}</td>
                  <td style={{ padding:'0.75rem', fontWeight:700 }}>{i.front}</td>
                  <td style={{ padding:'0.75rem' }}>{i.back}</td>
                  <td style={{ padding:'0.75rem', fontSize:'0.85rem', color:'var(--color-text-light)' }}>{i.hint||'–'}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
          {tab==='step' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {grouped[tab].map((i,idx)=>(
                <div key={idx} className="card" style={{ display:'flex', alignItems:'flex-start', gap:'1rem', padding:'1rem 1.25rem' }}>
                  <div style={{ background:'linear-gradient(135deg,#43E97B,#21D4FD)', color:'white', borderRadius:'50%', width:'2.5rem', height:'2.5rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, flexShrink:0 }}>{idx+1}</div>
                  <div><div style={{ fontWeight:700 }}>{i.front}</div><div style={{ color:'var(--color-text-light)', fontSize:'0.9rem' }}>{i.back}</div></div>
                </div>
              ))}
            </div>
          )}
          {['fact','concept'].includes(tab) && (
            <div className="grid-cards">
              {grouped[tab].map((i,idx)=>(
                <div key={idx} className="card">
                  <div style={{ fontSize:'1.75rem', marginBottom:'0.5rem' }}>{TYPE_LABELS[tab]?.emoji||'📌'}</div>
                  <h4 style={{ fontWeight:800, marginBottom:'0.5rem' }}>{i.front}</h4>
                  <p style={{ color:'var(--color-text-light)', fontSize:'0.9rem' }}>{i.back}</p>
                  {i.hint&&<p style={{ fontSize:'0.8rem', color:'var(--color-primary)', marginTop:'0.5rem' }}>💡 {i.hint}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {suggestedTechniqueIds?.length > 0 && (
        <div style={{ marginTop:'2rem' }}>
          <h3 style={{ fontWeight:800, marginBottom:'1rem' }}>🎯 Empfohlene Techniken für diesen Stoff:</h3>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
            {suggestedTechniqueIds.map(id=>(
              <button key={id} className="btn btn-primary" onClick={() => onSelectTechnique?.(id)} style={{ fontSize:'0.9rem' }}>
                Übungen mit {id.replace(/_/g,' ')} →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
