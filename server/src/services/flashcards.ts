import { generateFlashcards } from './mistral.js';

export type Flashcard = { front: string; back: string };

export async function buildFlashcardSet(text: string): Promise<Flashcard[]> {
  if (!text || text.length < 20) {
    return [];
  }
  return await generateFlashcards(text);
}
