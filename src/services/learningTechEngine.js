// LernHeld – Learning Technique Engine (vollstaendiges Modul aus Prompt 2)
export const LEARNING_TECHNIQUES = [
  { id:'loci', name:'Loci-Technik', emoji:'🏠', masterSkills:['visualising','connecting'],
    descriptionChildFriendly:'Du gehst in Gedanken durch ein bekanntes Haus und platzierst Infos als verrückte Bilder.',
    exampleTasks:['10 Vokabeln an Orten platzieren.','Planeten auf dem Schulweg ablegen.','Experiment-Schritte in Räumen.'],
    preferredTaskTypes:['vocabulary','facts','process'], preferredModalities:['visual','kinaesthetic'], effort:'medium', minTimeMinutes:15 },
  { id:'mind_map', name:'Mind Maps', emoji:'🕸️', masterSkills:['visualising','structuring','connecting'],
    descriptionChildFriendly:'Hauptthema in die Mitte, Äste mit Unterthemen drumherum.',
    exampleTasks:['Klimawandel-Mind-Map.','Referat planen.','Text-Zusammenfassung als Mind Map.'],
    preferredTaskTypes:['facts','text_comprehension','presentation'], preferredModalities:['visual'], effort:'easy', minTimeMinutes:10 },
  { id:'keyword', name:'Schlüsselwortmethode', emoji:'🔑', masterSkills:['connecting','visualising'],
    descriptionChildFriendly:'Ähnlich klingendes Wort + verrücktes Bild = Vokabel gemerkt!',
    exampleTasks:['"carrot" = Karosse = Prinzessin in Karotten-Kutsche.','5 Vokabeln mit Klang-Zwillingswörtern.'],
    preferredTaskTypes:['vocabulary'], preferredModalities:['visual','verbal'], effort:'easy', minTimeMinutes:5 },
  { id:'flashcard_box', name:'Karteikartensystem', emoji:'📇', masterSkills:['structuring','reducing'],
    descriptionChildFriendly:'Vorne Frage, hinten Antwort, 5-Fächer-System.',
    exampleTasks:['Vokabel-Kartei mit 5 Fächern.','Mathe-Formeln.','Biologie-Begriffe.'],
    preferredTaskTypes:['vocabulary','facts','exam_prep'], preferredModalities:['verbal'], effort:'medium', minTimeMinutes:15 },
  { id:'body_list', name:'Körperliste', emoji:'🧍', masterSkills:['visualising','connecting'],
    descriptionChildFriendly:'Körperstellen als Merkpunkte nutzen.',
    exampleTasks:['10 Vokabeln an Körperstellen.','Experiment-Schritte auf Körper verteilen.'],
    preferredTaskTypes:['vocabulary','process','facts'], preferredModalities:['kinaesthetic','visual'], effort:'easy', minTimeMinutes:10 },
  { id:'mnemonics', name:'Mnemo-Techniken', emoji:'🧠', masterSkills:['connecting','creating_tension'],
    descriptionChildFriendly:'Eselsbrücken, Reime und Akronyme.',
    exampleTasks:['Planeten-Merksatz.','Rap für Wochentage.','Kreisumfang-Satz.'],
    preferredTaskTypes:['facts','vocabulary','exam_prep'], preferredModalities:['verbal'], effort:'easy', minTimeMinutes:5 },
  { id:'high_five', name:'High-Five-Methode', emoji:'✋', masterSkills:['reducing','structuring'],
    descriptionChildFriendly:'5 Kernpunkte – einer pro Finger.',
    exampleTasks:['Klimawandel: 5 Finger = 5 Fakten.','Referat: 5 Pflichtpunkte.'],
    preferredTaskTypes:['facts','presentation','exam_prep'], preferredModalities:['kinaesthetic','verbal'], effort:'easy', minTimeMinutes:10 },
  { id:'knowledge_party', name:'WissensPAARty', emoji:'👫', masterSkills:['creating_tension','connecting'],
    descriptionChildFriendly:'Gemeinsam lernen und gegenseitig abfragen.',
    exampleTasks:['Vokabel-Blitz zu zweit.','Quiz-Battle.','Lehrer-Schüler-Rollenspiel.'],
    preferredTaskTypes:['vocabulary','facts','exam_prep'], preferredModalities:['social'], effort:'easy', minTimeMinutes:15 },
  { id:'loci', name:'Loci-Technik', emoji:'🏠', masterSkills:['visualising','connecting'],
    descriptionChildFriendly:'Gedächtnispalast durch bekanntes Gebäude.',
    exampleTasks:['Vokabeln in Zimmern platzieren.'],
    preferredTaskTypes:['vocabulary','facts'], preferredModalities:['visual'], effort:'medium', minTimeMinutes:15 }
];

export const DEFAULT_SUGGEST_WEIGHTS = { taskTypeMatch:40, modalityMatch:30, timeFeasibility:20, effortBonus:10 };
export const DEFAULT_RANK_WEIGHTS = { memory:0.6, fun:0.4 };

const TECHNIQUE_MAP = new Map(LEARNING_TECHNIQUES.map(t => [t.id, t]));

export function suggestTechniques(input, weights = DEFAULT_SUGGEST_WEIGHTS) {
  const { taskType, timeAvailable, modalities } = input;
  const scored = LEARNING_TECHNIQUES.filter((t,i,arr) => arr.findIndex(x=>x.id===t.id)===i).map(technique => {
    let score = 0; const reasons = [];
    if (technique.preferredTaskTypes.includes(taskType)) { score += weights.taskTypeMatch; reasons.push('Passt für diesen Aufgabentyp'); }
    const overlap = modalities.filter(m => technique.preferredModalities.includes(m)).length;
    if (overlap > 0) { score += Math.min(weights.modalityMatch, overlap * 15); reasons.push(overlap + ' Präferenz(en) passen'); }
    if (timeAvailable >= technique.minTimeMinutes * 2) { score += weights.timeFeasibility; reasons.push('Genug Zeit'); }
    else if (timeAvailable >= technique.minTimeMinutes) { score += weights.timeFeasibility / 2; reasons.push('Zeit knapp'); }
    else { score -= 10; }
    if (technique.effort === 'easy') { score += weights.effortBonus; reasons.push('Leicht zu erlernen'); }
    else if (technique.effort === 'medium') { score += weights.effortBonus / 2; }
    return { technique, score: Math.max(0, Math.min(100, Math.round(score))), reasons };
  });
  return scored.sort((a,b) => b.score - a.score).slice(0,5);
}

export function updateUserProfile(userProfile, sessionResult) {
  const { techniqueId, taskType, memoryScore, funScore, timestamp } = sessionResult;
  if (memoryScore < 1 || memoryScore > 5 || funScore < 1 || funScore > 5)
    throw new RangeError('Scores müssen zwischen 1 und 5 liegen');
  const updated = { ...userProfile, techniqueStats: { ...userProfile.techniqueStats },
    recentTaskTypes: [taskType, ...(userProfile.recentTaskTypes||[]).slice(0,9)] };
  const ex = updated.techniqueStats[techniqueId] ?? { memoryScores:[], funScores:[], usedForTypes:[], sessionCount:0 };
  updated.techniqueStats[techniqueId] = {
    memoryScores: [...ex.memoryScores.slice(-19), memoryScore],
    funScores: [...ex.funScores.slice(-19), funScore],
    usedForTypes: ex.usedForTypes.includes(taskType) ? ex.usedForTypes : [...ex.usedForTypes, taskType],
    sessionCount: ex.sessionCount + 1, lastUsed: timestamp ?? Date.now()
  };
  return updated;
}

export function rankTechniquesForUser(userProfile, taskType, weights = DEFAULT_RANK_WEIGHTS) {
  const eligible = LEARNING_TECHNIQUES.filter((t,i,arr) => arr.findIndex(x=>x.id===t.id)===i && t.preferredTaskTypes.includes(taskType));
  const ranked = eligible.map(technique => {
    const stats = userProfile.techniqueStats?.[technique.id];
    if (!stats || stats.sessionCount === 0) return { technique, personalScore:null, avgMemory:null, avgFun:null, sessionCount:0 };
    const avgMemory = stats.memoryScores.reduce((s,v)=>s+v,0)/stats.memoryScores.length;
    const avgFun = stats.funScores.reduce((s,v)=>s+v,0)/stats.funScores.length;
    const rawScore = avgMemory * weights.memory + avgFun * weights.fun;
    const personalScore = Math.round(((rawScore-1)/4)*100);
    const confidenceBonus = Math.min(5, Math.floor(stats.sessionCount/2));
    return { technique, personalScore: Math.min(100, personalScore+confidenceBonus),
      avgMemory: parseFloat(avgMemory.toFixed(2)), avgFun: parseFloat(avgFun.toFixed(2)), sessionCount: stats.sessionCount };
  });
  const withScore = ranked.filter(r=>r.personalScore!==null).sort((a,b)=>b.personalScore-a.personalScore);
  const withoutScore = ranked.filter(r=>r.personalScore===null).sort((a,b)=>a.technique.name.localeCompare(b.technique.name,'de'));
  return [...withScore, ...withoutScore];
}

export function createEmptyProfile(initialModalities = []) {
  return { userId: 'user_' + Math.random().toString(36).slice(2,10), techniqueStats:{}, modalities:initialModalities, recentTaskTypes:[] };
}
