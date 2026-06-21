import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import Startseite from './pages/Startseite.jsx';
import Lerntechniken from './pages/Lerntechniken.jsx';
import LernApp from './pages/LernApp.jsx';
import KiSicher from './pages/KiSicher.jsx';
import FuerEltern from './pages/FuerEltern.jsx';

export const AppContext = React.createContext();

function ElternEinwilligungModal({ onAccept }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card" style={{ maxWidth:500, width:'100%' }}>
        <div style={{ fontSize:'3rem', textAlign:'center', marginBottom:'1rem' }}>🔒</div>
        <h2 style={{ textAlign:'center', marginBottom:'1rem', fontSize:'1.5rem' }}>Kurzer Hinweis für Eltern</h2>
        <p style={{ marginBottom:'1rem', lineHeight:1.7 }}>
          Diese Website richtet sich an Kinder von 8–14 Jahren. Wir speichern <strong>keine personenbezogenen Daten</strong> –
          nur anonyme Lernfortschritte werden lokal auf diesem Gerät gespeichert (LocalStorage).
          Es werden keine Daten an Server übertragen.
        </p>
        <div className="safety-banner" style={{ marginBottom:'1.5rem' }}>
          <span style={{ fontSize:'1.5rem' }}>⚠️</span>
          <div><strong>Bitte beachten:</strong> Kinder sollen <em>keine</em> persönlichen Daten eingeben (Name, Adresse, Schule, Fotos oder Passwörter).</div>
        </div>
        <p style={{ fontSize:'0.85rem', color:'var(--color-text-light)', marginBottom:'1.5rem' }}>
          KI-generierte Analysen und Vorschläge in der Lern-App sind Unterstützungsangebote und ersetzen keine pädagogische Begleitung.
        </p>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:'1.1rem' }} onClick={onAccept}>
          ✅ Verstanden – App starten
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [lernProfil, setLernProfil] = useState(() => {
    try {
      const saved = localStorage.getItem('lernheld_profil');
      return saved ? JSON.parse(saved) : { scores: {}, sessionen: [] };
    } catch { return { scores: {}, sessionen: [] }; }
  });
  const [einwilligung, setEinwilligung] = useState(() =>
    localStorage.getItem('lernheld_einwilligung') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('lernheld_profil', JSON.stringify(lernProfil));
  }, [lernProfil]);

  const updateScore = (technikId, erinnerung, spass) => {
    setLernProfil(prev => {
      const ex = prev.scores[technikId] || { erinnerung:[], spass:[], count:0 };
      return {
        ...prev,
        scores: {
          ...prev.scores,
          [technikId]: {
            erinnerung: [...ex.erinnerung.slice(-9), erinnerung],
            spass: [...ex.spass.slice(-9), spass],
            count: ex.count + 1
          }
        }
      };
    });
  };

  return (
    <AppContext.Provider value={{ lernProfil, updateScore, einwilligung }}>
      {!einwilligung && <ElternEinwilligungModal onAccept={() => {
        localStorage.setItem('lernheld_einwilligung','true');
        setEinwilligung(true);
      }} />}
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        <Header />
        <main style={{ flex:1 }}>
          <Routes>
            <Route path="/" element={<Startseite />} />
            <Route path="/lerntechniken" element={<Lerntechniken />} />
            <Route path="/lern-app" element={<LernApp />} />
            <Route path="/ki-sicher" element={<KiSicher />} />
            <Route path="/fuer-eltern" element={<FuerEltern />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}
