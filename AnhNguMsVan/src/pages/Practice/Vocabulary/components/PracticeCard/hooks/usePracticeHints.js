import { useState, useEffect, useMemo } from 'react';

export const usePracticeHints = (word) => {
  const [revealedHints, setRevealedHints] = useState(new Set());
  const [hintCount, setHintCount] = useState(0);

  const wordChars = useMemo(() => {
    if (!word?.english) return [];
    return word.english.split('');
  }, [word?.english]);

  const displayChars = useMemo(() => {
    return wordChars.map((char, index) => {
      if (revealedHints.has(index)) return char;
      return char === ' ' ? ' ' : '*';
    });
  }, [wordChars, revealedHints]);

  // Reset khi chuyển từ mới
  useEffect(() => {
    setRevealedHints(new Set());
    setHintCount(0);
  }, [word?._id]);

  const revealNextHint = () => {
    const availableIndexes = wordChars
      .map((char, index) =>
        char !== ' ' && !revealedHints.has(index) ? index : null
      )
      .filter((index) => index !== null);

    if (availableIndexes.length === 0) {
      return false;
    }

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    
    setRevealedHints((prev) => new Set([...prev, randomIndex]));
    setHintCount((prev) => prev + 1);
    
    return true;
  };

  return {
    displayChars,
    hintCount,
    revealNextHint,
  };
};