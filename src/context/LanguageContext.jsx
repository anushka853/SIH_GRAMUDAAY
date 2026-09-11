import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../utils/translations';
import { speakText, stopSpeech } from '../utils/speechUtils';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const changeLanguage = (newLang) => {
    if (LANGUAGES.some((l) => l.code === newLang)) {
      setLang(newLang);
    }
  };

  const speak = (text) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, lang, () => setIsSpeaking(false));
    }
  };

  const stopAudio = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, languages: LANGUAGES, speak, stopAudio, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
