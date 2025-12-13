import React, { memo, useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { usePracticeProgress } from './hooks/usePracticeProgress';
import { usePracticeHints } from './hooks/usePracticeHints';
import { usePronunciation } from './hooks/usePronunciation';
import PracticeCardHeader from './PracticeCardHeader';
import PracticeCardPhonetics from './PracticeCardPhonetics';
import PracticeCardDefinitions from './PracticeCardDefinitions';
import PracticeCardAnswer from './PracticeCardAnswer';

const PracticeCard = memo(({
  word,
  wordIndex,
  totalWords,
  userAnswer,
  onProgressUpdate,
  setUserAnswer,
  showAnswer,
  isCorrect,
  correctAnswer,
  onCheckAnswer,
  onDontKnow,
  onNext,
  isAdmin,
  onEditWord,
  onDeleteWord,
  courseId,
  topicId,
}) => {
  const { user } = useAuth();
  
  // Custom hooks
  const { saveWordProgress } = usePracticeProgress(courseId, topicId, word);
  const { displayChars, hintCount, revealNextHint } = usePracticeHints(word);
  const { playPronunciation } = usePronunciation();

  // Local state
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // useEffect(() => {
  //   if (!showAnswer) {
  //     setIsFlipped(false);
  //   }
  // }, [showAnswer]);

  // Helper functions
  const getVietnameseWordType = (type) => {
    const typeMap = {
      noun: 'Danh từ',
      verb: 'Động từ',
      adjective: 'Tính từ',
      adverb: 'Trạng từ',
      pronoun: 'Đại từ',
      preposition: 'Giới từ',
      conjunction: 'Liên từ',
      interjection: 'Thán từ',
      other: 'Khác',
    };
    return typeMap[type] || 'Danh từ';
  };

  const getEnglishWordType = (type) => {
    const typeMap = {
      noun: 'Noun',
      verb: 'Verb',
      adjective: 'Adjective',
      adverb: 'Adverb',
      pronoun: 'Pronoun',
      preposition: 'Preposition',
      conjunction: 'Conjunction',
      interjection: 'Interjection',
      other: 'Other',
    };
    return typeMap[type] || 'Noun';
  };

  // Auth check
  const checkAuth = () => {
    if (!user) {
      setShowAuthBanner(true);
      setTimeout(() => setShowAuthBanner(false), 8000);
      return false;
    }
    setShowAuthBanner(false);
    return true;
  };

  // Flip card
  const handleViewDetail = () => {
    setIsFlipped(true);
    setTimeout(() => playPronunciation(word.english, 'US'), 250);
  };

  // Handle "Không biết"
  const handleDontKnow = async () => {
    if (!checkAuth()) return;
    onDontKnow();
    await saveWordProgress(false, onProgressUpdate);
    handleViewDetail();
  };

  // Handle hint click
  const handleHintClick = () => {
    if (hintCount >= 3) {
      playPronunciation(word.english, 'US');
    } else {
      revealNextHint();
    }
  };

  // Handle check answer
  const handleCheckAnswer = async () => {
    if (!checkAuth()) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = word.english.trim().toLowerCase();

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      onCheckAnswer(); // Set showAnswer = true

      // Save progress
      const result = await saveWordProgress(true, onProgressUpdate);

      if (!result.success) {
        alert('Lỗi khi lưu tiến độ: ' + (result.error || 'Unknown error'));
      }

      // Flip card
      handleViewDetail();
    } else {
      // Wrong answer - Shake animation
      const inputElement = document.querySelector('.answer-input-group input');
      if (inputElement) {
        inputElement.classList.add('shake-error');
        setTimeout(() => inputElement.classList.remove('shake-error'), 500);
      }
    }
  };

  if (!word) return null;

  return (
    <div className="practice-content">
      {/* Image Container */}
      <div className="word-image-container">
        <img
          src={word.image}
          alt={word.english}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Info Panel */}
      <div className="word-info">
          {/* Header */}
          <PracticeCardHeader
            word={word}
            isFlipped={isFlipped}
            isAdmin={isAdmin}
            onEditWord={onEditWord}
            onDeleteWord={onDeleteWord}
            getVietnameseWordType={getVietnameseWordType}
            getEnglishWordType={getEnglishWordType}
          />

          {/* Phonetics */}
          {isFlipped && (
            <PracticeCardPhonetics
              word={word}
              playPronunciation={playPronunciation}
            />
          )}

          {/* Definitions */}
          <PracticeCardDefinitions
            word={word}
            showAnswer={showAnswer}
          />

          {/* Answer Section */}
          <PracticeCardAnswer
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            showAnswer={showAnswer}
            showAuthBanner={showAuthBanner}
            setShowAuthBanner={setShowAuthBanner}
            displayChars={displayChars}
            hintCount={hintCount}
            onHintClick={handleHintClick}
            onCheckAnswer={handleCheckAnswer}
            onDontKnow={handleDontKnow}
            onNext={onNext}
            correctAnswer={correctAnswer}
            isFlipped={isFlipped}
          />
      </div>
    </div>
  );
});

PracticeCard.displayName = 'PracticeCard';

export default PracticeCard;