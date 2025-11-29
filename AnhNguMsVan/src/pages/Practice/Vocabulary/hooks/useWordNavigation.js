import { useState, useEffect, useCallback } from 'react';
import { wordPrefetcher } from '../utils/wordPrefetch';

export const useWordNavigation = (selectedTopic, currentTopicIndex, topics) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Prefetch ảnh khi topic hoặc word thay đổi
  useEffect(() => {
    if (selectedTopic?.words) {
      // Prefetch 3 từ tiếp theo
      wordPrefetcher.prefetchNextWords(selectedTopic.words, currentWordIndex, 3);
      
      // Prefetch toàn bộ topic trong background (priority thấp)
      wordPrefetcher.prefetchTopicImages(selectedTopic.words);
    }
  }, [selectedTopic, currentWordIndex]);

  const handleCheckAnswer = useCallback(() => {
    if (!selectedTopic?.words?.[currentWordIndex]) return;
    
    const currentWord = selectedTopic.words[currentWordIndex];
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentWord.vietnamese.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
  }, [selectedTopic, currentWordIndex, userAnswer]);

  const handleDontKnow = useCallback(() => {
    setShowAnswer(true);
    setIsCorrect(false);
  }, []);

  const handleNextWord = useCallback(() => {
    const totalWords = selectedTopic?.words?.length || 0;
    
    // Reset answer state
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);

    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Chuyển sang topic tiếp theo
      if (currentTopicIndex < topics.length - 1) {
        return { nextTopic: true, nextTopicIndex: currentTopicIndex + 1 };
      } else {
        return { completed: true };
      }
    }
    return { continue: true };
  }, [selectedTopic, currentWordIndex, currentTopicIndex, topics]);

  const resetWordState = useCallback(() => {
    setCurrentWordIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  }, []);

  return {
    currentWordIndex,
    userAnswer,
    showAnswer,
    isCorrect,
    setUserAnswer,
    setCurrentWordIndex,
    handleCheckAnswer,
    handleDontKnow,
    handleNextWord,
    resetWordState
  };
};