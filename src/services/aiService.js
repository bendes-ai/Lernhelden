import { LERNTECHNIKEN, AUFGABENTYP_TECHNIKEN, PRAEFERENZ_TECHNIKEN } from '../data/lerntechniken.js';

export async function analyzeMaterial(text) {
  const lower = text.toLowerCase();
  let typ = 'fakten';
  if (lower.includes('schritt')||lower.includes('zunächst')||lower.includes('dann')) typ = 'prozesse';
  else if (lower.includes('bedeutet')||lower.match(/\b[a-z]+ = /i)) typ = 'vokabeln';
  else if (text.split('.').length > 5) typ = 'textverstaendnis';
  await new Promise(r => setTimeout(r, 400));
  return {
    typ, schluesselwoerter: text.split(/\s+/).filter(w=>w.length>4).slice(0,8),
    schwierigkeit: text.length>500?'schwer':text.length>200?'mittel':'einfach',
    vorschlaege: AUFGABENTYP_TECHNIKEN[typ]||[]
  };
}

export function suggestTechniques(kontext) {
  const { aufgabentyp, zeitMinuten, praeferenz } = kontext;
  let kandidaten = new Set();
  (AUFGABENTYP_TECHNIKEN[aufgabentyp]||[]).forEach(id=>kandidaten.add(id));
  if (praeferenz && PRAEFERENZ_TECHNIKEN[praeferenz]) PRAEFERENZ_TECHNIKEN[praeferenz].forEach(id=>kandidaten.add(id));
  let ergebnis = LERNTECHNIKEN.filter(t=>kandidaten.has(t.id));
  if (zeitMinuten < 15) ergebnis = ergebnis.filter(t=>t.aufwand==='einfach');
  else if (zeitMinuten < 30) ergebnis = ergebnis.filter(t=>t.aufwand!=='schwer');
  return ergebnis.slice(0,5);
}

export async function generateExercises(technikId, material, typ) {
  const technik = LERNTECHNIKEN.find(t=>t.id===technikId);
  if (!technik) return [];
  await new Promise(r=>setTimeout(r,600));
  return technik.beispielaufgaben.map((aufgabe,i) => ({ id:i, text:aufgabe, technikId, typ:'beispiel' }));
}
