import React, { useState, useRef, useCallback } from 'react';

const DEMOS = [
  { id:'vocab_demo', label:'📚 Beispiel-Vokabelliste laden', desc:'10 Englisch-Vokabeln (apple, dog, teacher…)', type:'vocab' },
  { id:'process_demo', label:'🔬 Beispiel-Experiment laden', desc:'Ablauf eines wissenschaftlichen Experiments', type:'process' },
  { id:'facts_demo', label:'🌍 Beispiel-Faktenblatt laden', desc:'5 Kernpunkte zum Klimawandel', type:'facts' }
];

function getMockAnalysis(type) {
  if (type==='vocab') return { uploadId:'vocab_demo', materialType:'vocabulary', language:'en', difficulty:'easy', itemCount:10,
    extractedItems:[
      {type:'vocabulary',front:'apple',back:'Apfel',hint:'klingt wie Äppel'},
      {type:'vocabulary',front:'dog',back:'Hund'},{type:'vocabulary',front:'teacher',back:'Lehrer'},
      {type:'vocabulary',front:'school',back:'Schule'},{type:'vocabulary',front:'book',back:'Buch'},
      {type:'vocabulary',front:'car',back:'Auto'},{type:'vocabulary',front:'house',back:'Haus'},
      {type:'vocabulary',front:'water',back:'Wasser'},{type:'vocabulary',front:'sun',back:'Sonne'},
      {type:'vocabulary',front:'friend',back:'Freund'}],
    keywords:['apple','dog','teacher','school'], suggestedTechniqueIds:['loci','koerperliste','kette','karteikasten'], processedAt:Date.now() };
  if (type==='process') return { uploadId:'process_demo', materialType:'process', language:'de', difficulty:'medium', itemCount:6,
    extractedItems:[{type:'step',front:'Schritt 1',back:'Beobachtung notieren'},{type:'step',front:'Schritt 2',back:'Hypothese aufstellen'},
      {type:'step',front:'Schritt 3',back:'Experiment durchführen'},{type:'step',front:'Schritt 4',back:'Ergebnisse messen'},
      {type:'step',front:'Schritt 5',back:'Auswertung'},{type:'step',front:'Schritt 6',back:'Fazit ziehen'}],
    keywords:['Hypothese','Experiment','Auswertung'], suggestedTechniqueIds:['koerperliste','fuenf-schritt'], processedAt:Date.now() };
  return { uploadId:'facts_demo', materialType:'facts', language:'de', difficulty:'medium', itemCount:5,
    extractedItems:[{type:'fact',front:'Was ist der Treibhauseffekt?',back:'CO2 hält Wärme in der Atmosphäre'},
      {type:'fact',front:'Folgen des Klimawandels',back:'Gletscherschmelze, Meeresanstieg'},
      {type:'fact',front:'Hauptursachen',back:'Fossile Brennstoffe und Abholzung'},
      {type:'fact',front:'Lösungen',back:'Erneuerbare Energien, weniger Fleisch'},
      {type:'fact',front:'Was ist Methan?',back:'Treibhausgas von Kühen und Reisfeldern'}],
    keywords:['Klimawandel','CO2','Treibhauseffekt'], suggestedTechniqueIds:['mindmap','highfive','mnemo'], processedAt:Date.now() };
}

export default function MaterialUpload({ onAnalysisComplete }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = useCallback(file => {
    if (!file) return;
    setPreview({ url:URL.createObjectURL(file), name:file.name });
  }, []);

  const loadDemo = async demo => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onAnalysisComplete(getMockAnalysis(demo.type));
  };

  const analyze = async () => {
    if (!text.trim() && !preview) return;
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations/analyze-image', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ uploadId:`text_${Date.now()}`, rawText:text })
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      onAnalysisComplete(d.analysis);
    } catch {
      onAnalysisComplete(getMockAnalysis('facts'));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="safety-banner" style={{ marginBottom:'1.5rem' }}>
        <span style={{ fontSize:'1.25rem' }}>🔒</span>
        <p style={{ fontSize:'0.9rem' }}><strong>Datenschutz:</strong> Gib nur Schulstoff ein – keine persönlichen Daten (Name, Adresse, Schule)!</p>
      </div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', background:'#F3F4F6', borderRadius:'12px', padding:'4px' }}>
        {[{id:'text',l:'📝 Text einfügen'},{id:'image',l:'📷 Bild hochladen'}].map(m => (
          <button key={m.id} className="btn" onClick={() => setMode(m.id)} style={{ flex:1, justifyContent:'center', padding:'0.6rem', borderRadius:'10px', background:mode===m.id?'white':'transparent', color:mode===m.id?'var(--color-primary)':'var(--color-text-light)', fontSize:'0.9rem', boxShadow:mode===m.id?'0 2px 8px rgba(0,0,0,0.1)':'none' }}>{m.l}</button>
        ))}
      </div>
      {mode==='text' && (
        <div className="form-group">
          <label className="form-label">✏️ Schulstoff hier einfügen:</label>
          <textarea className="form-control" rows={7} placeholder="Füge hier deinen Schulstoff ein, z.B.:&#10;apple = Apfel&#10;dog = Hund&#10;..." value={text} onChange={e => setText(e.target.value)} style={{ resize:'vertical', fontFamily:'monospace', fontSize:'0.9rem' }} />
          <p style={{ fontSize:'0.8rem', color:'var(--color-text-light)', marginTop:'0.25rem' }}>{text.length} Zeichen</p>
        </div>
      )}
      {mode==='image' && (
        <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          style={{ border:'2px dashed #D1D5DB', borderRadius:'var(--border-radius)', padding:'2.5rem', textAlign:'center', cursor:'pointer', background:'#FAFAFA', marginBottom:'1rem' }}>
          {preview ? <div><img src={preview.url} alt="Vorschau" style={{ maxWidth:'100%', maxHeight:'180px', borderRadius:'8px', marginBottom:'0.5rem' }} /><p style={{ fontWeight:700, color:'var(--color-primary)' }}>✅ {preview.name}</p></div>
            : <div><div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>📤</div><p style={{ fontWeight:700 }}>Foto hierher ziehen oder klicken</p><p style={{ fontSize:'0.85rem', color:'var(--color-text-light)' }}>JPG, PNG – max. 5 MB</p></div>}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />
      <button className="btn btn-primary" onClick={analyze} disabled={loading||(!text.trim()&&!preview)} style={{ width:'100%', justifyContent:'center', marginBottom:'1.5rem' }}>
        {loading ? '⏳ Wird analysiert…' : '🔍 Lernstoff analysieren'}
      </button>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
        <div style={{ flex:1, height:1, background:'#E5E7EB' }} /><span style={{ fontSize:'0.85rem', color:'var(--color-text-light)', whiteSpace:'nowrap' }}>oder Demo laden</span><div style={{ flex:1, height:1, background:'#E5E7EB' }} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {DEMOS.map(d => (
          <button key={d.id} className="btn btn-outline" onClick={() => loadDemo(d)} disabled={loading} style={{ justifyContent:'flex-start', padding:'0.9rem 1.25rem' }}>
            <div><div style={{ fontWeight:700 }}>{d.label}</div><div style={{ fontSize:'0.8rem', color:'var(--color-text-light)', fontWeight:400 }}>{d.desc}</div></div>
          </button>
        ))}
      </div>
      {loading && <div style={{ textAlign:'center', marginTop:'1.5rem' }}><div style={{ fontSize:'2.5rem', animation:'float 1s ease-in-out infinite' }}>🧠</div><p style={{ fontWeight:700 }}>Analysiere Lernstoff…</p></div>}
    </div>
  );
}
