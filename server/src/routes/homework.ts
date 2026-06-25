import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractTextFromImage } from '../services/ocr.js';
import { detectSubject, generateExercises } from '../services/mistral.js';
import { buildFlashcardSet } from '../services/flashcards.js';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Kein Bild hochgeladen.' });
  }

  const filePath = path.resolve(file.path);

  try {
    const text = await extractTextFromImage(filePath);

    if (!text || text.length < 15) {
      return res.status(422).json({
        error: 'Der Text konnte nicht erkannt werden. Bitte ein deutlicheres Foto machen.'
      });
    }

    const [subject, exercises, flashcards] = await Promise.all([
      detectSubject(text),
      generateExercises(subject ?? 'Sonstiges', text),
      buildFlashcardSet(text)
    ]);

    return res.json({ text, subject, exercises, flashcards });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fehler bei der Verarbeitung.' });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default router;
