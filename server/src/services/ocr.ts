import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  const worker = await createWorker('deu+eng');
  try {
    const { data } = await worker.recognize(imagePath);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}
