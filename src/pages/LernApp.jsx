import React, { useState, useContext } from 'react';
import { AppContext } from '../App.jsx';
import LernFinder from '../components/App/LernFinder.jsx';
import MaterialUpload from '../components/App/MaterialUpload.jsx';
import OcrResultPanel from '../components/App/OcrResultPanel.jsx';
import ExerciseDisplay from '../components/App/ExerciseDisplay.jsx';
import ProfilAuswertung from '../components/App/ProfilAuswertung.jsx';
import { LERNTECHNIKEN } from '../data/lerntechniken.js';

const TABS = [{id:'finder',l:'🎯 Technik-Finder'},{id:'upload',l:'📤 Stoff analysieren'},{id:'profil',l:'📊 Mein Profil'}];

function getDemoExerciseSet(technikId, analysis) {
  const items = analysis?.extractedItems?.slice(0,5)||[];
  return {
    techniqueId: technikId,
    exercises: items.map((item,i) => ({ id:`demo_${i}`, type:technikId==='loci'||technikId==='koerperliste'?'loci_placement':'flashcard',
      instruction:`Übung ${i+1}: ${technikId==='loci'?'Platziere als Bild in deinem Zuhause':'Beantworte die Frage'}`,
      content:{ question:item.front, answer:item.back, hint:item.hint, visual:technikId==='loci'?`Stell dir ein riesiges "${item.back}" vor!`:undefined },
      difficulty:'easy', estimatedMinutes:2 })),
    totalEstimatedMinutes: items.length*2,
    encouragement:'🌟 Klasse gemacht! Du bist auf dem richtigen Weg!'
  };
}

export default function LernApp() {
  const { lernProfil, updateScore } = useContext(AppContext);
  const [tab, setTab] = useState('finder');
  const [analysis, setAnalysis] = useState(null);
  const [technikId, setTechnikId] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = r => { setAnalysis(r); setTechnikId(null); setExercises(null); };

  const selectTechnik = async id => {
    setTechnikId(id); setLoading(true);
    try {
      const res = await fetch('/api/recommendations/generate-exercises', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ techniqueId:id, analysis, targetCount:5 }) });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setExercises(d.exerciseSet);
    } catch { setExercises(getDemoExerciseSet(id, analysis)); }
    setLoading(false);
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem' }}>🚀</div>
          <h1 className="section-title">Meine Lern-App</h1>
          <p className="section-subtitle">Technik-Finder, Stoff-Analyse und persönlicher Trainer in einem!</p>
        </div>

        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', background:'white', borderRadius:'var(--border-radius)', padding:'6px', boxShadow:'var(--shadow)', overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} className="btn" onClick={() => setTab(t.id)} style={{ flex:'1 1 auto', justifyContent:'center', padding:'0.75rem', borderRadius:'10px', background:tab===t.id?'linear-gradient(135deg,#6C63FF,#8B5CF6)':'transparent', color:tab===t.id?'white':'var(--color-text-light)', fontSize:'0.9rem', whiteSpace:'nowrap' }}>{t.l}</button>
          ))}
        </div>

        {tab==='finder' && <div className="card"><LernFinder /></div>}

        {tab==='upload' && (
          <div>
            {!analysis ? (
              <div className="card">
                <h2 style={{ fontWeight:800, marginBottom:'0.5rem' }}>📤 Schulstoff analysieren</h2>
                <p style={{ color:'var(--color-text-light)', marginBottom:'1.5rem' }}>Text einfügen, Bild hochladen oder Demo-Button nutzen – sofort loslegen ohne Anmeldung!</p>
                <MaterialUpload onAnalysisComplete={handleAnalysis} />
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                  <h2 style={{ fontWeight:800 }}>🔍 Erkannter Lernstoff</h2>
                  <button className="btn btn-outline" onClick={() => { setAnalysis(null); setExercises(null); setTechnikId(null); }} style={{ fontSize:'0.85rem' }}>← Neuer Stoff</button>
                </div>
                {!exercises ? (
                  <div className="card">
                    <OcrResultPanel analysis={analysis} onSelectTechnique={selectTechnik} />
                    {loading && <div style={{ textAlign:'center', padding:'2rem' }}><div style={{ fontSize:'2.5rem', animation:'float 1s ease-in-out infinite' }}>🧠</div><p style={{ fontWeight:700, marginTop:'0.5rem' }}>Übungen werden erstellt…</p></div>}
                  </div>
                ) : (
                  <div className="card">
                    <div style={{ marginBottom:'1.5rem' }}>
                      <h3 style={{ fontWeight:800 }}>🎯 Übungen: {technikId?.replace(/_/g,' ')}</h3>
                      <button className="btn btn-outline" onClick={() => setExercises(null)} style={{ marginTop:'0.5rem', fontSize:'0.85rem' }}>← Andere Technik</button>
                    </div>
                    <ExerciseDisplay exerciseSet={exercises} onComplete={({ correct, total }) => { if(technikId) updateScore(technikId, Math.round((correct/total)*4)+1, 4); }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab==='profil' && <div className="card"><ProfilAuswertung lernProfil={lernProfil} /></div>}
      </div>
    </div>
  );
}
