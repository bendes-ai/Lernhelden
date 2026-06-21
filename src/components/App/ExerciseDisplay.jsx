import React, { useState } from 'react';
const EX_LABELS = { flashcard:{l:'Karteikarte',e:'📇'}, loci_placement:{l:'Gedächtnisort',e:'🏠'}, quiz:{l:'Quiz',e:'🎮'}, fill_blank:{l:'Lückentext',e:'✏️'}, story_chain:{l:'Kettengeschichte',e:'⛓️'} };

function FlashCard({ ex, onRate }) {
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  return (
    <div style={{ marginBottom:'1.5rem' }}>
      <p style={{ fontSize:'0.9rem', color:'var(--color-text-light)', marginBottom:'0.75rem' }}>📌 {ex.instruction}</p>
      <div onClick={() => setFlipped(!flipped)} style={{ background:flipped?'linear-gradient(135deg,#43E97B,#21D4FD)':'linear-gradient(135deg,#6C63FF,#8B5CF6)', color:'white', borderRadius:'var(--border-radius)', padding:'2rem', textAlign:'center', cursor:'pointer', minHeight:140, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'all 0.4s', boxShadow:'0 6px 24px rgba(108,99,255,0.3)' }}>
        <div style={{ fontSize:'1.75rem' }}>{flipped?'✅':'❓'}</div>
        <div style={{ fontSize:'1.1rem', fontWeight:700, lineHeight:1.4 }}>{flipped?ex.content.answer:ex.content.question}</div>
        {!flipped&&<div style={{ fontSize:'0.8rem', opacity:0.8 }}>Tippe zum Umdrehen</div>}
        {flipped&&ex.content.visual&&<div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'8px', padding:'0.5rem 1rem', fontSize:'0.85rem', marginTop:'0.5rem' }}>🎨 {ex.content.visual}</div>}
      </div>
      {ex.content.hint&&<button className="btn btn-outline" onClick={() => alert('💡 Tipp: '+ex.content.hint)} style={{ marginTop:'0.75rem', fontSize:'0.85rem', padding:'0.4rem 1rem' }}>💡 Tipp</button>}
      {flipped&&!rated&&(
        <div style={{ marginTop:'1rem', textAlign:'center' }}>
          <p style={{ fontWeight:700, marginBottom:'0.5rem' }}>Hast du es gewusst?</p>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
            <button className="btn" onClick={() => { setRated(true); onRate('yes'); }} style={{ background:'#43E97B', color:'white', fontSize:'1.1rem', padding:'0.6rem 1.5rem' }}>✅ Ja!</button>
            <button className="btn" onClick={() => { setRated(true); onRate('no'); }} style={{ background:'#FF6584', color:'white', fontSize:'1.1rem', padding:'0.6rem 1.5rem' }}>❌ Nein</button>
          </div>
        </div>
      )}
      {rated&&<p style={{ textAlign:'center', marginTop:'0.75rem', fontWeight:700, color:'var(--color-primary)' }}>⭐ Bewertet!</p>}
    </div>
  );
}

export default function ExerciseDisplay({ exerciseSet, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  if (!exerciseSet) return null;
  const { exercises, encouragement } = exerciseSet;
  const cur = exercises[idx];
  const info = EX_LABELS[cur?.type]||{l:cur?.type,e:'📄'};

  const rate = res => {
    const newR = [...results, { id:cur.id, result:res }];
    setResults(newR);
    if (idx < exercises.length-1) setTimeout(() => setIdx(idx+1), 700);
    else { setDone(true); const c=newR.filter(r=>r.result==='yes').length; onComplete?.({correct:c,total:exercises.length}); }
  };

  if (done) {
    const correct = results.filter(r=>r.result==='yes').length;
    const pct = Math.round((correct/exercises.length)*100);
    return (
      <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>{pct>=80?'🏆':pct>=50?'⭐':'💪'}</div>
        <h3 style={{ fontWeight:900, fontSize:'1.5rem', marginBottom:'0.5rem' }}>{pct>=80?'Super gemacht!':pct>=50?'Gut, weiter so!':'Noch mehr üben!'}</h3>
        <div style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', color:'white', borderRadius:'50px', padding:'0.5rem 2rem', fontWeight:900, fontSize:'1.3rem', display:'inline-block', margin:'0.75rem 0' }}>{correct}/{exercises.length} richtig ({pct}%)</div>
        <p style={{ color:'var(--color-text-light)', marginBottom:'1.5rem' }}>{encouragement}</p>
        <button className="btn btn-primary" onClick={() => { setIdx(0); setResults([]); setDone(false); }}>🔁 Nochmal</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'var(--color-text-light)', marginBottom:'0.4rem' }}>
          <span>{info.e} {info.l} {idx+1} / {exercises.length}</span>
          <span>⏱️ ca. {exercises.slice(idx).reduce((s,e)=>s+e.estimatedMinutes,0)} Min.</span>
        </div>
        <div style={{ height:8, background:'#E5E7EB', borderRadius:50, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(idx/exercises.length)*100}%`, background:'linear-gradient(90deg,#6C63FF,#43E97B)', borderRadius:50, transition:'width 0.4s' }} />
        </div>
      </div>
      {(cur.type==='flashcard'||cur.type==='quiz') && <FlashCard ex={cur} onRate={rate} />}
      {cur.type==='loci_placement' && (
        <div>
          <div className="card" style={{ borderLeft:'4px solid #6C63FF', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
            <div style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', color:'white', borderRadius:'12px', width:'3rem', height:'3rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, flexShrink:0 }}>{idx+1}</div>
            <div>
              <p style={{ fontWeight:700, marginBottom:'0.25rem' }}>📍 {cur.content.question}</p>
              <p style={{ fontSize:'0.85rem', color:'var(--color-text-light)', marginBottom:'0.5rem' }}>{cur.instruction}</p>
              {cur.content.visual&&<div style={{ background:'rgba(108,99,255,0.08)', borderRadius:'8px', padding:'0.5rem', fontSize:'0.85rem', color:'var(--color-primary)' }}>🎨 {cur.content.visual}</div>}
              <div style={{ marginTop:'0.75rem', background:'rgba(67,233,123,0.15)', border:'1px solid #43E97B', borderRadius:'8px', padding:'0.5rem 0.75rem', fontWeight:700, color:'#1A7A40' }}>✅ {cur.content.answer}</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => rate('yes')} style={{ marginTop:'1rem', width:'100%', justifyContent:'center' }}>
            Weiter → {idx<exercises.length-1?'Nächster Ort':'Fertig!'}
          </button>
        </div>
      )}
      {!['flashcard','quiz','loci_placement'].includes(cur.type) && (
        <div className="card">
          <h4 style={{ fontWeight:800, marginBottom:'0.5rem' }}>{info.e} {cur.instruction}</h4>
          <p style={{ marginBottom:'1rem' }}>{cur.content.question}</p>
          <button className="btn btn-primary" onClick={() => rate('yes')}>Weiter →</button>
        </div>
      )}
    </div>
  );
}
