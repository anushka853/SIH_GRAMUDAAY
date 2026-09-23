import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../utils/translations';
import { speakText, stopSpeech } from '../utils/speechUtils';

const LanguageContext = createContext();

const LS_LANG_KEY = 'gramuday-language';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_LANG_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch { /* ignore */ }
    return 'en';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync lang to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_LANG_KEY, lang);
    } catch { /* ignore */ }
  }, [lang]);

  const t = (key) => {
    if (!key) return '';
    const keys = key.split('.');

    const getValue = (dict, keyArr) => {
      let current = dict;
      for (const k of keyArr) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return undefined;
        }
      }
      return current;
    };

    // 1. Try selected language
    let value = getValue(TRANSLATIONS[lang], keys);
    if (value !== undefined) return value;

    // 2. Try English fallback
    if (lang !== 'en') {
      value = getValue(TRANSLATIONS['en'], keys);
      if (value !== undefined) return value;
    }

    // 3. Fallback to raw key (don't return undefined)
    return key;
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
