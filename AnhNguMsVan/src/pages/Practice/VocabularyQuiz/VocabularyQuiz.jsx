import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import "./VocabularyQuiz.css";

const VocabularyQuiz = () => {
    const { topicId, level } = useParams();
    const navigate = useNavigate();
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    // Mock data - thay thế bằng API call thực tế
    const quizData = {
        topicName: "Daily Life",
        level: "A1",
        questions: [
            {
                id: 1,
                word: "TRAVEL",
                image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
                audioUrl: "/audio/travel.mp3",
                options: [
                    { id: "A", text: "To move from one place to another.", isCorrect: true },
                    { id: "B", text: "The act of eating a large meal.", isCorrect: false },
                    { id: "C", text: "A piece of furniture used for storage.", isCorrect: false },
                    { id: "D", text: "A strong feeling of being nervous or excited.", isCorrect: false }
                ]
            },
            {
                id: 2,
                word: "BREAKFAST",
                image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400",
                audioUrl: "/audio/breakfast.mp3",
                options: [
                    { id: "A", text: "The first meal of the day.", isCorrect: true },
                    { id: "B", text: "A hot drink made from beans.", isCorrect: false },
                    { id: "C", text: "A place to sleep at night.", isCorrect: false },
                    { id: "D", text: "An outdoor activity.", isCorrect: false }
                ]
            }
            // Thêm các câu hỏi khác...
        ]
    };

    const totalQuestions = quizData.questions.length;
    const question = quizData.questions[currentQuestion];

    const handleAnswerClick = (option) => {
        if (selectedAnswer) return; // Đã chọn rồi thì không cho chọn nữa
        
        setSelectedAnswer(option.id);
        setIsCorrect(option.isCorrect);
        
        if (option.isCorrect) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            // Kết thúc quiz - chuyển đến trang kết quả
            navigate(`/vocabulary/result`, { 
                state: { 
                    score, 
                    total: totalQuestions,
                    topicName: quizData.topicName,
                    level: quizData.level
                } 
            });
        }
    };

    const handlePlayAudio = () => {
        const audio = new Audio(question.audioUrl);
        audio.play();
    };

    const handleExit = () => {
        if (window.confirm("Bạn có chắc muốn thoát? Tiến độ sẽ không được lưu.")) {
            navigate("/vocabulary");
        }
    };

    const getAnswerClass = (optionId) => {
        if (!selectedAnswer) return "";
        if (optionId === selectedAnswer) {
            return isCorrect ? "correct" : "incorrect";
        }
        // Hiển thị đáp án đúng nếu user chọn sai
        if (!isCorrect && question.options.find(opt => opt.id === optionId)?.isCorrect) {
            return "correct-answer";
        }
        return "";
    };

    return (
        <div className="vocabulary-quiz-page">
            <Header />
            
            <div className="quiz-container">
                {/* Header quiz */}
                <div className="quiz-header">
                    <h2>Từ Vựng: {quizData.topicName} ({quizData.level})</h2>
                    <button className="exit-btn" onClick={handleExit}>
                        ✕ Thoát (Về trang chọn chủ đề)
                    </button>
                </div>

                {/* Progress bar */}
                <div className="progress-container">
                    <div className="progress-info">
                        <span>Câu {currentQuestion + 1}/{totalQuestions}</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question card */}
                <div className="question-card">
                    
                    {/* Word với audio */}
                    <div className="word-section">
                        <h3 className="question-instruction">Chọn định nghĩa đúng cho từ sau:</h3>
                        <h1 className="word-text">{question.word}</h1>
                        <button className="audio-btn" onClick={handlePlayAudio}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </button>
                    </div>

                    {/* Hình ảnh minh họa */}
                    <div className="word-image-container">
                        <img 
                            src={question.image} 
                            alt={question.word}
                            className="word-image"
                        />
                    </div>

                    {/* Options */}
                    <div className="options-grid">
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                className={`option-btn ${getAnswerClass(option.id)}`}
                                onClick={() => handleAnswerClick(option)}
                                disabled={selectedAnswer !== null}
                            >
                                <span className="option-id">{option.id}.</span>
                                <span className="option-text">{option.text}</span>
                            </button>
                        ))}
                    </div>

                    {/* Feedback */}
                    {selectedAnswer && (
                        <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                            {isCorrect ? (
                                <span>✓ Chính xác! Tuyệt vời!</span>
                            ) : (
                                <span>✗ Chưa đúng. Thử lại ở bài sau nhé!</span>
                            )}
                        </div>
                    )}

                    {/* Next button */}
                    {selectedAnswer && (
                        <div className="next-button-container">
                            <button className="next-btn" onClick={handleNextQuestion}>
                                {currentQuestion < totalQuestions - 1 ? 'Tiếp Theo →' : 'Xem Kết Quả'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocabularyQuiz;