import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeCardAnswer = memo(({
  userAnswer,
  setUserAnswer,
  showAnswer,
  showAuthBanner,
  setShowAuthBanner,
  displayChars,
  hintCount,
  onHintClick,
  onCheckAnswer,
  onDontKnow,
  onNext,
  correctAnswer,
  isFlipped
}) => {
  const navigate = useNavigate();


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showAnswer) {
      onCheckAnswer();
    }
  };

  if (showAnswer) {
    return isFlipped ? (
      <div className="answer-result-section">
        <div className="answer-feedback correct">
          {correctAnswer.english}
        </div>

        <div className="action-buttons">
          <button className="btn-next" onClick={onNext} type="button">
            Tiếp theo →
          </button>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      {/* Hint Section */}
      <div className="hint-section">
        <div className="hint-display">
          {displayChars.map((char, index) => (
            <span
              key={index}
              className={`hint-char ${
                char !== '*' && char !== ' ' ? 'revealed' : ''
              } ${char === ' ' ? 'space' : ''}`}
            >
              {char}
            </span>
          ))}
        </div>

        <button
          className={`hint-btn ${hintCount >= 3 ? 'hint-btn-audio' : ''}`}
          onClick={onHintClick}
          type="button"
        >
          <span className="hint-icon">
            {hintCount >= 3 ? '🔊' : '💡'}
          </span>
          {hintCount >= 3 ? 'Phát âm' : 'Gợi ý'}
        </button>
      </div>

      {/* Answer Section */}
      <div className="answer-section">
        {/* Auth Banner */}
        {showAuthBanner && (
          <div className="auth-banner">
            <div className="auth-banner-content">
              <div className="auth-banner-text">
                <p>Đăng nhập để kiểm tra và lưu tiến độ học.</p>
              </div>
              <button
                className="auth-banner-login-btn"
                onClick={() => navigate('/login')}
                type="button"
              >
                Đăng nhập ngay
              </button>
              {/* <button
                className="auth-banner-close"
                onClick={() => setShowAuthBanner(false)}
                type="button"
              >
                ✕
              </button> */}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="answer-input-group">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập từ tiếng Anh"
            autoFocus
          />
        </div>

        {/* Buttons */}
        <div className="action-buttons">
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
        </div>
      </div>
    </>
  );
});

PracticeCardAnswer.displayName = 'PracticeCardAnswer';

export default PracticeCardAnswer;