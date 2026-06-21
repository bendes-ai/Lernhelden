// server/src/prompts.ts
export const SYSTEM_PROMPT = `Du bist ein pädagogischer Assistent für Kinder von 8–14 Jahren.
Aufgaben:
- Schulstoff analysieren und Lerntechniken empfehlen
- Kindgerechte Übungsaufgaben auf Deutsch generieren
- Einfache, klare Sprache (Niveau 5.–8. Klasse)
- Niemals persönliche Daten einfordern
- Antworte immer auf Deutsch. Formatiere Ausgaben als valides JSON.`;

export const PROMPT_ANALYZE_MATERIAL = `Analysiere den folgenden Schulstoff und gib ein JSON-Objekt zurück.

Schulstoff:
"""
{{MATERIAL_TEXT}}
"""

Gib folgendes JSON zurück (kein Markdown):
{
  "materialType": "vocabulary|facts|process|text_comprehension|mixed",
  "language": "de|en|...",
  "difficulty": "easy|medium|hard",
  "itemCount": <Zahl>,
  "extractedItems": [{ "type":"vocabulary|fact|step|concept","front":"...","back":"...","hint":"..." }],
  "keywords": ["..."],
  "suggestedTechniqueIds": ["loci","mind_map","..."],
  "teacherNote": "..."
}`;

export const PROMPT_SUGGEST_TECHNIQUES = `Du kennst folgende Lerntechniken:
{{TECHNIQUES_JSON}}

Lernkontext:
- Materialtyp: {{MATERIAL_TYPE}}
- Inhalt: {{MATERIAL_SUMMARY}}
- Lernpräferenzen: {{MODALITIES}}
- Verfügbare Zeit: {{TIME_AVAILABLE}} Minuten

Wähle 3–5 passende Techniken. Gib JSON zurück:
{
  "recommendations": [
    { "techniqueId":"...","score":<0-100>,"reason":"...","quickTip":"..." }
  ]
}`;

export const PROMPT_GENERATE_EXERCISES = `Erstelle Lernübungen für Kinder (8–14 Jahre)
mit der Lerntechnik "{{TECHNIQUE_NAME}}" (ID: {{TECHNIQUE_ID}}).

Lernmaterial:
{{EXTRACTED_ITEMS}}

Erstelle {{TARGET_COUNT}} Übungsaufgaben. Gib JSON zurück:
{
  "techniqueId": "{{TECHNIQUE_ID}}",
  "exercises": [
    { "id":"...","type":"flashcard|loci_placement|quiz|fill_blank|story_chain",
      "instruction":"...","content":{"question":"...","answer":"...","hint":"...","visual":"..."},
      "difficulty":"easy|medium|hard","estimatedMinutes":<1-5> }
  ],
  "totalEstimatedMinutes": <Summe>,
  "encouragement": "..."
}`;

export function fillPrompt(template, values) {
  return Object.entries(values).reduce(
    (p, [k, v]) => p.replaceAll("{{" + k + "}}", v), template
  );
}

export function buildClaudeRequest(userPrompt, maxTokens = 1500, temperature = 0.3) {
  return {
    model: "claude-opus-4-5",
    max_tokens: maxTokens,
    temperature,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }]
  };
}
