import React, { memo, useEffect, useState, useMemo, useRef } from "react";

const PracticeCard = memo(
  ({
    word,
    wordIndex,
    totalWords,
    userAnswer,
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
  }) => {
    // Existing hooks
    const [revealedHints, setRevealedHints] = useState(new Set());
    const [hintCount, setHintCount] = useState(0);
    
    // NEW: Flip state - chỉ lật nội dung
    const [isFlipped, setIsFlipped] = useState(false);
    const audioRefUS = useRef(null);
    const audioRefUK = useRef(null);

    const wordChars = useMemo(() => {
      if (!correctAnswer?.english) return [];
      return correctAnswer.english.split('');
    }, [correctAnswer?.english]);

    const displayChars = useMemo(() => {
      return wordChars.map((char, index) => {
        if (revealedHints.has(index)) {
          return char;
        }
        return char === ' ' ? ' ' : '*';
      });
    }, [wordChars, revealedHints]);

    useEffect(() => {
      setRevealedHints(new Set());
      setHintCount(0);
      setIsFlipped(false); // Reset flip khi chuyển từ mới
    }, [word?._id]);


    const handleHintClick = () => {
      if (hintCount >= 3) {
        return;
      }

      const availableIndexes = wordChars
        .map((char, index) => (char !== ' ' && !revealedHints.has(index) ? index : null))
        .filter(index => index !== null);

      if (availableIndexes.length === 0) {
        alert('Đã hiện hết tất cả ký tự!');
        return;
      }

      const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      setRevealedHints(prev => new Set([...prev, randomIndex]));
      setHintCount(prev => prev + 1);
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !showAnswer) {
        onCheckAnswer();
      }
    };

    const handleDelete = () => {
      if (
        window.confirm(
          `Bạn có chắc muốn xóa từ "${word.vietnamese}" (${word.english})?`
        )
      ) {
        onDeleteWord(word);
      }
    };

    // NEW: Handle flip - Lật nội dung
    const handleViewDetail = () => {
      setIsFlipped(true);
      // Auto play US pronunciation
      setTimeout(() => {
        playPronunciation('US');
      }, 300);
    };

    // NEW: Handle pronunciation
    const playPronunciation = (accent) => {
      // Kiểm tra browser support
      if (!('speechSynthesis' in window)) {
        console.error('Browser không hỗ trợ Text-to-Speech');
        alert('Trình duyệt của bạn không hỗ trợ phát âm');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word.english);
      
      // Chọn giọng theo accent
      const voices = window.speechSynthesis.getVoices();
      
      if (accent === 'US') {
        // Tìm giọng US
        const usVoice = voices.find(voice => 
          voice.lang === 'en-US' || 
          voice.name.includes('US') ||
          voice.name.includes('United States')
        );
        if (usVoice) {
          utterance.voice = usVoice;
        }
        utterance.lang = 'en-US';
      } else {
        // Tìm giọng UK
        const ukVoice = voices.find(voice => 
          voice.lang === 'en-GB' || 
          voice.name.includes('UK') ||
          voice.name.includes('British')
        );
        if (ukVoice) {
          utterance.voice = ukVoice;
        }
        utterance.lang = 'en-GB';
      }

      utterance.rate = 0.8; // Tốc độ nói (0.8 = 80% speed)
      utterance.pitch = 1; // Cao độ giọng nói
      utterance.volume = 1; // Âm lượng

      console.log('Playing pronunciation:', {
        text: word.english,
        accent,
        voice: utterance.voice?.name || 'default',
        lang: utterance.lang
      });

      window.speechSynthesis.speak(utterance);
    };

    // Preload voices khi component mount
    useEffect(() => {
      if ('speechSynthesis' in window) {
        // Load voices
        window.speechSynthesis.getVoices();
        
        // Lắng nghe event voices changed
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }, []);

    // NEW: Get pronunciation URL from API (text-to-speech)
    // const getPronunciationURL = (text, accent = 'US') => {
    //   const lang = accent === 'US' ? 'en-US' : 'en-GB';
    //   return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    // };

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

        {/* Info Panel with Flip Content */}
        <div className="word-info">
          {/* Header with Admin Actions */}
          <div className="word-header">
            {/* Title with Flip Animation */}
            <div className={`word-title-container ${isFlipped ? 'flipped' : ''}`}>
              <h3 className="word-title word-title-front">
                {word.vietnamese}
              </h3>
              <h3 className="word-title word-title-back">
                {word.english}
              </h3>
            </div>
            <p className="word-type">{word.wordType || "Danh từ"}</p>

            {isAdmin && (
              <div className="word-actions">
                <button
                  className="edit-word-btn"
                  onClick={() => onEditWord(word)}
                  type="button"
                  title="Sửa từ vựng"
                >
                  ✏️
                </button>
                <button
                  className="delete-word-btn"
                  onClick={handleDelete}
                  type="button"
                  title="Xóa từ vựng"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {/* Phonetics - Hiển thị khi đã flip */}
          {isFlipped && (
            <div className="phonetics-section">
              <div className="phonetic-row">
                <div className="phonetic-item">
                  <span className="phonetic-flag">🇺🇸</span>
                  <span className="phonetic-label">US:</span>
                  <span className="phonetic-text">
                    /{word.phoneticUS || word.english}/
                  </span>
                  <button 
                    className="audio-btn"
                    onClick={() => playPronunciation('US')}
                    type="button"
                    title="Phát âm US"
                  >
                    🔊
                  </button>
                </div>

                <div className="phonetic-item">
                  <span className="phonetic-flag">🇬🇧</span>
                  <span className="phonetic-label">UK:</span>
                  <span className="phonetic-text">
                    /{word.phoneticUK || word.english}/
                  </span>
                  <button 
                    className="audio-btn"
                    onClick={() => playPronunciation('UK')}
                    type="button"
                    title="Phát âm UK"
                  >
                    🔊
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Definitions */}
          <div className="word-definitions">
            {word.definition && (
              <p className="definition-en">
                <strong>Định nghĩa tiếng Anh:</strong> {word.definition}
              </p>
            )}
            {word.meaning && (
              <p className="definition-vn">
                <strong>Định nghĩa tiếng Việt:</strong> {word.meaning}
              </p>
            )}
            {word.example && (
              <p className="example-en">
                <strong>Ví dụ tiếng Anh:</strong> {word.example}
              </p>
            )}
            {word.exampleVN && (
              <p className="example-vn">
                <strong>Ví dụ tiếng Việt:</strong> {word.exampleVN}
              </p>
            )}
          </div>

          {/* Hint System */}
          {!showAnswer && (
            <div className="hint-section">
              <div className="hint-display">
                {displayChars.map((char, index) => (
                  <span 
                    key={index} 
                    className={`hint-char ${char !== '*' && char !== ' ' ? 'revealed' : ''} ${char === ' ' ? 'space' : ''}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              
              <button 
                className="hint-btn" 
                onClick={handleHintClick}
                disabled={hintCount >= 3}
                type="button"
              >
                <span className="hint-icon">💡</span>
                Gợi ý
              </button>
            </div>
          )}
         
          {/* Answer Section */}
          <div className="answer-section">
            <div className="answer-input-group">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập từ tiếng Anh"
                disabled={showAnswer}
                className={
                  showAnswer ? (isCorrect ? "correct" : "incorrect") : ""
                }
                autoFocus
              />
            </div>

            {showAnswer && (
              <div
                className={`answer-feedback ${
                  isCorrect ? "correct" : "incorrect"
                }`}
              >
                {isCorrect ? "✓ Chính xác!" : `✗ Đáp án: ${correctAnswer.english}`}
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {!showAnswer ? (
                <>
                  <button
                    className="btn-dont-know"
                    onClick={onDontKnow}
                    type="button"
                  >
                    <span>🤷</span>
                    Không biết
                  </button>
                  <button
                    className="btn-check"
                    onClick={onCheckAnswer}
                    type="button"
                  >
                    <span>🔍</span>
                    Kiểm tra đáp án
                  </button>
                </>
              ) : (
                <>
                  {!isFlipped && (
                    <button
                      className="btn-view-detail"
                      onClick={handleViewDetail}
                      type="button"
                    >
                      <span>📖</span>
                      Xem chi tiết
                    </button>
                  )}
                  <button className="btn-next" onClick={onNext} type="button">
                    Tiếp theo →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PracticeCard.displayName = "PracticeCard";

export default PracticeCard;