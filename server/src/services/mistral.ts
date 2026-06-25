import Mistral from '@mistralai/mistralai';
import dotenv from 'dotenv';
dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function detectSubject(text: string): Promise<string> {
  const response = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: `Lies folgenden Text von einem Schulblatt und erkenne das Schulfach.
Antworte nur mit einem einzigen Wort: Mathe, Deutsch, Englisch, Geschichte, Geografie, Biologie, Physik, Chemie oder Sonstiges.

Text:
${text}`
      }
    ]
  });
  return response.choices?.[0]?.message?.content?.trim() ?? 'Sonstiges';
}

export async function generateExercises(
  subject: string,
  text: string
): Promise<string[]> {
  const response = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: `Du bist ein Lernassistent für Schulkinder.
Basierend auf folgendem Schulstoff (Fach: ${subject}) erstelle genau 5 kurze, altersgerechte Übungsaufgaben.
Gib nur die 5 Aufgaben aus, eine pro Zeile, nummeriert 1–5.

Schulstoff:
${text}`
      }
    ]
  });
  const raw = response.choices?.[0]?.message?.content ?? '';
  return raw
    .split('\n')
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(l => l.length > 5);
}

export async function generateFlashcards(
  text: string
): Promise<{ front: string; back: string }[]> {
  const response = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: `Erstelle aus folgendem Schulstoff genau 5 Karteikarten für Kinder.
Format: jede Karte in einer eigenen Zeile im Format:
FRAGE|||ANTWORT

Schulstoff:
${text}`
      }
    ]
  });
  const raw = response.choices?.[0]?.message?.content ?? '';
  return raw
    .split('\n')
    .filter(l => l.includes('|||'))
    .map(l => {
      const [front, back] = l.split('|||');
      return { front: front.trim(), back: back.trim() };
    });
}
