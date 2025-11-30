import { useState, useEffect, useCallback } from 'react';
import { wordPrefetcher } from '../utils/wordPrefetch';

export const useWordNavigation = (selectedTopic, currentTopicIndex, topics) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleCheckAnswer = useCallback(() => {
    if (!selectedTopic?.words?.[currentWordIndex]) {
      console.error('No word found');
      return;
    }

    const currentWord = selectedTopic.words[currentWordIndex];
    const correctAnswer = currentWord.english;
    
    // Normalize và so sánh (case-insensitive, trim spaces)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
    
    console.log('Checking answer:', {
      userInput: normalizedUserAnswer,
      correctAnswer: normalizedCorrectAnswer,
      isMatch: normalizedUserAnswer === normalizedCorrectAnswer
    });

    const answerIsCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    setIsCorrect(answerIsCorrect);
    setShowAnswer(true);
  }, [selectedTopic, currentWordIndex, userAnswer]);

  // Prefetch ảnh khi topic hoặc word thay đổi
  useEffect(() => {
    if (selectedTopic?.words) {
      // Prefetch 3 từ tiếp theo
      wordPrefetcher.prefetchNextWords(selectedTopic.words, currentWordIndex, 3);
      
      // Prefetch toàn bộ topic trong background (priority thấp)
      wordPrefetcher.prefetchTopicImages(selectedTopic.words);
    }
  }, [selectedTopic, currentWordIndex]);


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