# LernHeld 🦸 – Clever lernen & KI sicher nutzen

Kostenlose Lernplattform für Kinder von 8–14 Jahren mit 22 Lerntechniken,
einer persönlichen Lern-App und kindgerechten KI-Sicherheitsinformationen.

## Schnellstart (nur Frontend, kein Server nötig)

```bash
npm install
npm run dev
# → http://localhost:5173
```

Alle Funktionen laufen im **Demo-Modus** ohne Server oder API-Key.

## Mit Mock-Backend (optional)

```bash
# Terminal 1 – Frontend
npm install && npm run dev

# Terminal 2 – Mock-Server
cd server && npm install && npm run dev
# → http://localhost:3001
```

Der Vite-Proxy leitet /api-Anfragen an localhost:3001 weiter.

## Demo-Buttons

In der Lern-App → „Stoff analysieren":

| Button | Inhalt | Getestete Features |
|---|---|---|
| 📚 Beispiel-Vokabelliste | 10 Englisch-Vokabeln | Tabellen, Karteikarten, Loci |
| 🔬 Beispiel-Experiment | 6 Prozessschritte | Schritt-Ansicht, Körperliste |
| 🌍 Beispiel-Faktenblatt | 5 Klimawandel-Fakten | Karten-Ansicht, Mind Map |

## IONOS Deploy Now

1. Repository auf GitHub pushen (Datei `.ionos.yaml` muss vorhanden sein)
2. https://www.ionos.com/hosting/deploy-now aufrufen
3. GitHub-Account verbinden, dieses Repository auswählen
4. Framework: React (Vite) – Build-Befehl: `npm run build` – Dist: `dist`
5. Deploy Now erstellt automatisch `.github/workflows/deploy-now.yaml`
6. Jeder Push auf `main` triggert Build & Deploy ✅

> Das Node.js-Backend (`server/`) läuft nicht auf IONOS Shared Hosting.
> Für Produktion mit LLM: IONOS VPS oder direkter Claude API-Call mit VITE_ANTHROPIC_API_KEY.

## LLM-Integration aktivieren

```bash
# server/.env
ANTHROPIC_API_KEY=sk-ant-...
ALLOWED_ORIGIN=https://deine-domain.ionos.de
```

In `server/src/services/OcrAndExerciseService.ts` die kommentierten
`fetch`-Aufrufe einkommentieren, Mock-Returns auskommentieren.

## Projektstruktur

```
lernheld/
├── .ionos.yaml                ← Deploy-Now-Konfiguration
├── .github/workflows/         ← GitHub Actions (IONOS Deploy)
├── src/
│   ├── pages/                 ← 5 Seiten (Start, Techniken, App, KI, Eltern)
│   ├── components/            ← Layout, UI, App-Komponenten
│   ├── data/                  ← Lerntechniken, KI-Content, MASTERFÄHIGKEITEN
│   └── services/              ← KI-Engine, Storage, LernTechnik-Engine
└── server/                    ← Optionales Express-Backend (Mock-LLM)
    └── src/
        ├── prompts.ts         ← Alle LLM-Prompt-Templates
        └── services/
            └── OcrAndExerciseService.ts
```

## Datenschutz

- Keine Registrierung, kein Login
- Keine Tracker oder Analyse-Cookies
- Lernfortschritte nur im Browser-LocalStorage
- Keine persönlichen Daten in KI-Analysen (Demo-Modus)
