const KEYS = { PROFIL:'lernheld_profil', EINWILLIGUNG:'lernheld_einwilligung' };

export function getProfilScore(technikId) {
  try { const p = JSON.parse(localStorage.getItem(KEYS.PROFIL)||'{}'); return p.scores?.[technikId]||null; } catch { return null; }
}
export function saveBewertung(technikId, erinnerung, spass) {
  try {
    const p = JSON.parse(localStorage.getItem(KEYS.PROFIL)||'{"scores":{}}');
    const ex = p.scores[technikId]||{erinnerung:[],spass:[],count:0};
    p.scores[technikId] = { erinnerung:[...ex.erinnerung.slice(-9),erinnerung], spass:[...ex.spass.slice(-9),spass], count:ex.count+1 };
    localStorage.setItem(KEYS.PROFIL, JSON.stringify(p)); return true;
  } catch { return false; }
}
export function getAlleScores() {
  try { return JSON.parse(localStorage.getItem(KEYS.PROFIL)||'{"scores":{}}').scores||{}; } catch { return {}; }
}
export function berechneScore(technikId, gewichtErinnerung=0.6) {
  const d = getProfilScore(technikId);
  if (!d||d.count===0) return null;
  const avgE = d.erinnerung.reduce((a,b)=>a+b,0)/d.erinnerung.length;
  const avgS = d.spass.reduce((a,b)=>a+b,0)/d.spass.length;
  return (avgE*gewichtErinnerung + avgS*(1-gewichtErinnerung)).toFixed(2);
}
export function resetProfil() { localStorage.removeItem(KEYS.PROFIL); }
