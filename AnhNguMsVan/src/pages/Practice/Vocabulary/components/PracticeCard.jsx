import React, { memo } from "react";

/* thẻ card luyện tập từ vựng bao gồm cả phần trả lời */
const PracticeCard = memo(
  ({
    // WordCard props
    word,
    wordIndex,
    totalWords,

    // AnswerSection props
    userAnswer,
    setUserAnswer,
    showAnswer,
    isCorrect,
    correctAnswer,
    onCheckAnswer,
    onDontKnow,
    onNext,
  }) => {
    if (!word) return null;

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !showAnswer) {
        onCheckAnswer();
      }
    };

    return (
      <div className="practice-content">
        {/* Image + Word Info */}
        <div className="word-image-container">
          <img
            src={word.image}
            alt={word.english}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="word-info">
          <h3 className="word-title">{word.english}</h3>
          <p className="word-type">{word.wordType || "Danh từ"}</p>

          <div className="word-definitions">
            {word.definition && (
              <p className="definition-en">{word.definition}</p>
            )}
            {word.meaning && <p className="definition-vn">{word.meaning}</p>}
            {word.example && <p className="example-en">{word.example}</p>}
            {word.exampleVN && <p className="example-vn">{word.exampleVN}</p>}
          </div>

          {/* Answer Section */}
          <div className="answer-section">
            <div className="answer-input-group">
              <input
                type="password"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập từ tiếng Việt"
                disabled={showAnswer}
                className={
                  showAnswer ? (isCorrect ? "correct" : "incorrect") : ""
                }
                autoFocus
              />

              <button className="hint-btn" type="button">
                <span className="hint-icon">💡</span>
                gợi ý
              </button>
            </div>

            {showAnswer && (
              <div
                className={`answer-feedback ${
                  isCorrect ? "correct" : "incorrect"
                }`}
              >
                {isCorrect ? "✓ Chính xác!" : `✗ Đáp án: ${correctAnswer}`}
              </div>
            )}

            <div className="action-buttons">
              {!showAnswer ? (
                <>
                  <button
                    className="btn-dont-know"
                    onClick={onDontKnow}
                    type="button"
                  >
                    <span>🤷</span>
                    không biết
                  </button>
                  <button
                    className="btn-check"
                    onClick={onCheckAnswer}
                    type="button"
                  >
                    <span>🔍</span>
                    kiểm tra đáp án
                  </button>
                </>
              ) : (
                <button className="btn-next" onClick={onNext} type="button">
                  Tiếp theo →
                </button>
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
