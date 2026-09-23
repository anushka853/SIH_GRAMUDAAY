import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { startVoiceRecognition } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceButton({ onTranscript }) {
  const { lang, t } = useLanguage();
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

  const titleText = isListening ? (t('voice.stopListening') || 'Stop Listening') : (t('voice.placeholder') || 'Voice input...');

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={titleText}
      className="flex items-center justify-center rounded-lg transition-all flex-shrink-0"
      style={{
        width: '2.375rem',
        height: '2.375rem',
        background: isListening ? 'var(--danger-light)' : 'var(--bg-elevated)',
        color: isListening ? 'var(--danger)' : 'var(--text-muted)',
        border: isListening ? '1px solid var(--danger)' : '1px solid var(--border-default)',
        animation: isListening ? 'pulseSub 1.5s ease-in-out infinite' : 'none',
      }}
    >
      {isListening ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
