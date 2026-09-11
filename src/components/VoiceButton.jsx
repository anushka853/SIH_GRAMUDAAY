import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { startVoiceRecognition } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceButton({ onTranscript, placeholder = 'Voice input...' }) {
  const { lang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const toggleListening = () => {
    if (isListening && recognitionInstance) {
      recognitionInstance.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const recognition = startVoiceRecognition(
      lang,
      (transcript) => {
        if (onTranscript) onTranscript(transcript);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setRecognitionInstance(recognition);
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={isListening ? 'Stop Listening' : 'Speak to Input (Voice Dictation)'}
      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
        isListening
          ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-900/50'
          : 'bg-slate-800/90 text-emerald-400 border-slate-700 hover:border-emerald-500 hover:bg-slate-800'
      }`}
    >
      {isListening ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span className="text-[11px]">Listening...</span>
        </div>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
