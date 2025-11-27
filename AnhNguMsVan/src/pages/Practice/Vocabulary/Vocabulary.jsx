import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import "./Vocabulary.css";

const Vocabulary = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Mock data - Thay bằng API call thực tế
  const topics = [
    {
      id: 1,
      name: "Gia đình",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/family_topic.png",
      progress: 50,
      totalWords: 50,
      learnedWords: 25,
      words: [
        {
          english: "family",
          vietnamese: "gia đình",
          definition: "Định nghĩa tiếng Anh: My house have 4 people in home",
          meaning: "Định nghĩa: ngôi nhà có các thành viên trong nhà",
          example: "Example: My family there is 5 people",
          exampleVN: "Ví dụ: 1 gia đình có các thành viên trong đó",
          image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/family_word.png"
        },
        {
          english: "father",
          vietnamese: "bố",
          definition: "A male parent",
          meaning: "Cha của một người",
          example: "My father is a teacher",
          exampleVN: "Bố tôi là một giáo viên",
          image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/father_word.png"
        }
      ]
    },
    {
      id: 2,
      name: "Công việc",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/work_topic.png",
      progress: 50,
      totalWords: 50,
      learnedWords: 25,
      words: []
    },
    {
      id: 3,
      name: "Du lịch",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/travel_topic.png",
      progress: 50,
      totalWords: 50,
      learnedWords: 25,
      words: []
    },
    {
      id: 4,
      name: "Khách sạn",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/hotel_topic.png",
      progress: 50,
      totalWords: 50,
      learnedWords: 25,
      words: []
    }
  ];

  const currentTopic = topics[currentTopicIndex];
  const currentWord = currentTopic.words[currentWordIndex];
  const totalWordsInTopic = currentTopic.words.length;

  const handleCheckAnswer = () => {
    if (userAnswer.trim().toLowerCase() === currentWord.vietnamese.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setShowAnswer(true);
  };

  const handleDontKnow = () => {
    setShowAnswer(true);
    setIsCorrect(false);
  };

  const handleNextWord = () => {
    if (currentWordIndex < totalWordsInTopic - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Chuyển sang topic tiếp theo
      if (currentTopicIndex < topics.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
        setCurrentWordIndex(0);
      } else {
        alert("Bạn đã hoàn thành tất cả các từ!");
      }
    }
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const handleTopicClick = (topicIndex) => {
    setCurrentTopicIndex(topicIndex);
    setCurrentWordIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  return (
    <>
      <Header />
      <div className="vocabulary-page">
        <div className="vocabulary-container">
          {/* Left Panel - Practice Area */}
          <div className="practice-panel">
            {/* Header với topic name và progress */}
            <div className="practice-header">
              <h2 className="topic-name">{currentTopic.name}</h2>
              <div className="word-counter">
                câu {currentWordIndex + 1}/{totalWordsInTopic}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentWordIndex + 1) / totalWordsInTopic) * 100}%` }}
              ></div>
            </div>

            {/* Main Content Area */}
            <div className="practice-content">
              {/* Word Image */}
              <div className="word-image-container">
                <img src={currentWord.image} alt={currentWord.english} />
              </div>

              {/* Word Information */}
              <div className="word-info">
                <h3 className="word-title">{currentWord.english}</h3>
                <p className="word-type">Danh từ</p>

                {/* Definitions */}
                <div className="word-definitions">
                  <p className="definition-en">{currentWord.definition}</p>
                  <p className="definition-vn">{currentWord.meaning}</p>
                  <p className="example-en">{currentWord.example}</p>
                  <p className="example-vn">{currentWord.exampleVN}</p>
                </div>

                {/* Answer Input */}
                <div className="answer-section">
                  <div className="answer-input-group">
                    <input
                      type="password"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !showAnswer && handleCheckAnswer()}
                      placeholder="Nhập từ tiếng Anh"
                      disabled={showAnswer}
                      className={showAnswer ? (isCorrect ? 'correct' : 'incorrect') : ''}
                    />
                    <button className="hint-btn">
                      <span className="hint-icon">💡</span>
                      gợi ý
                    </button>
                  </div>

                  {showAnswer && (
                    <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓ Chính xác!' : `✗ Đáp án: ${currentWord.vietnamese}`}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {!showAnswer ? (
                      <>
                        <button className="btn-dont-know" onClick={handleDontKnow}>
                          <span>🤷</span>
                          không biết
                        </button>
                        <button className="btn-check" onClick={handleCheckAnswer}>
                          <span>🔍</span>
                          kiểm tra đáp án
                        </button>
                      </>
                    ) : (
                      <button className="btn-next" onClick={handleNextWord}>
                        Tiếp theo →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Topics List */}
          <div className="topics-panel">
            <h3 className="topics-panel-title">Danh sách chủ đề</h3>
            <div className="topics-scroll">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className={`topic-item ${index === currentTopicIndex ? 'active' : ''}`}
                  onClick={() => handleTopicClick(index)}
                >
                  <div className="topic-image">
                    <img src={topic.image} alt={topic.name} />
                  </div>
                  <div className="topic-info">
                    <h4 className="topic-title">{topic.name}</h4>
                    <div className="topic-stats">
                      <span className="topic-progress">{topic.progress}%</span>
                      <span className="topic-words">{topic.learnedWords}/{topic.totalWords} từ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vocabulary;