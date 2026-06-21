import React from 'react';
import { LERNTECHNIKEN } from '../../data/lerntechniken.js';
import { berechneScore, resetProfil } from '../../services/storageService.js';

export default function ProfilAuswertung({ lernProfil }) {
  const scores = lernProfil?.scores || {};
  const techniken = LERNTECHNIKEN.map(t => ({
    ...t, score: berechneScore(t.id), data: scores[t.id]
  })).filter(t => t.data).sort((a,b) => parseFloat(b.score||0) - parseFloat(a.score||0));

  if (techniken.length === 0) return (
    <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>📊</div>
      <h3 style={{ fontWeight:800, marginBottom:'0.5rem' }}>Noch keine Daten</h3>
      <p style={{ color:'var(--color-text-light)' }}>Probiere Lerntechniken in der App aus – dein Profil füllt sich automatisch!</p>
    </div>
  );

  const maxScore = Math.max(...techniken.map(t => parseFloat(t.score||0)));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontWeight:800 }}>📊 Dein persönliches Profil</h2>
          <p style={{ color:'var(--color-text-light)', fontSize:'0.9rem' }}>{techniken.length} Techniken ausprobiert</p>
        </div>
        <button className="btn btn-outline" style={{ fontSize:'0.8rem' }} onClick={() => { if(window.confirm('Profil wirklich löschen?')) { resetProfil(); window.location.reload(); } }}>
          🗑️ Zurücksetzen
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {techniken.map((t, i) => {
          const s = parseFloat(t.score||0);
          const pct = maxScore > 0 ? (s/maxScore)*100 : 0;
          const avgE = t.data.erinnerung.reduce((a,b)=>a+b,0)/t.data.erinnerung.length;
          const avgS = t.data.spass.reduce((a,b)=>a+b,0)/t.data.spass.length;
          return (
            <div key={t.id} className="card" style={{ padding:'1rem 1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'1.75rem' }}>{t.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700 }}>{i===0?'🏆 ':''}{t.name}</span>
                    <span style={{ fontWeight:900, color:'var(--color-primary)' }}>{s}/5.0</span>
                  </div>
                  <div style={{ height:8, background:'#E5E7EB', borderRadius:50, marginTop:'0.3rem', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#6C63FF,#43E97B)', borderRadius:50, transition:'width 0.8s ease' }} />
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', fontSize:'0.8rem', color:'var(--color-text-light)' }}>
                <span>🧠 Erinnerung: {avgE.toFixed(1)}/5</span>
                <span>😄 Spaß: {avgS.toFixed(1)}/5</span>
                <span>📅 Sessions: {t.data.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
