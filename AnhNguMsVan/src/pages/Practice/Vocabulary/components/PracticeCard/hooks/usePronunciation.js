import { useEffect, useCallback } from 'react';

export const usePronunciation = () => {
  // Preload voices khi component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();

      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const playPronunciation = useCallback((text, accent = 'US') => {
    if (!('speechSynthesis' in window)) {
      console.error('Browser không hỗ trợ Text-to-Speech');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (accent === 'US') {
      const usVoice = voices.find(
        (voice) =>
          voice.lang === 'en-US' ||
          voice.name.includes('US') ||
          voice.name.includes('United States')
      );
      if (usVoice) utterance.voice = usVoice;
      utterance.lang = 'en-US';
    } else {
      const ukVoice = voices.find(
        (voice) =>
          voice.lang === 'en-GB' ||
          voice.name.includes('UK') ||
          voice.name.includes('British')
      );
      if (ukVoice) utterance.voice = ukVoice;
      utterance.lang = 'en-GB';
    }

    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  return { playPronunciation };
};