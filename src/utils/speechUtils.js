// Web Speech API Utility for Voice-to-Text Dictation & Speech Synthesis

// Language locale map for Web Speech API
export const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN'
};

/**
 * Voice Recognition (Speech-to-Text)
 * @param {string} langCode - Language code ('en', 'hi', 'mr', etc.)
 * @param {function} onResult - Callback receiving recognized text string
 * @param {function} onError - Callback on error
 * @param {function} onEnd - Callback when recognition stops
 */
export function startVoiceRecognition(langCode, onResult, onError, onEnd) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech Recognition API is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = SPEECH_LANG_MAP[langCode] || 'en-IN';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    if (onError) onError(err.message);
    return null;
  }
}

/**
 * Text-to-Speech Synthesis (Voice Assistant Speaker)
 * @param {string} text - Text to speak
 * @param {string} langCode - Language code
 * @param {function} onEnd - Callback when speech ends
 */
export function speakText(text, langCode = 'en', onEnd = null) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis not supported');
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || text.trim() === '') return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_MAP[langCode] || 'en-IN';
  utterance.rate = 0.95; // Slightly slower pace for rural clarity
  utterance.pitch = 1.0;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error', e);
    if (onEnd) onEnd();
  };

  // Attempt to select an Indian accent or regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetLang = SPEECH_LANG_MAP[langCode] || 'en-IN';
  const matchingVoice = voices.find((v) => v.lang === targetLang || v.lang.startsWith(langCode));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any active text-to-speech output
 */
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
