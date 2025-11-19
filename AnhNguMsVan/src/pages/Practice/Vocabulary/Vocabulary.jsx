import React from "react";
import Header from "../../../components/Header/Header.jsx";
import { LEVELS, getLevelColor, getLevelInfo } from "../../Practice/Vocabulary/Levels.jsx"
import "./Vocabulary.css";

const Vocabulary = () => {
    const topics = [
        {
            id: 1,
            title: "Daily Life – Cuộc sống hằng ngày",
            subtitle: "Routine, habits, chores...",
        },
        {
            id: 2,
            title: "Work & Office – Công sở & công việc",
            subtitle: "Meeting, deadline, career...",
        },
        {
            id: 3,
            title: "Travel & Transportation – Du lịch & phương tiện",
            subtitle: "Airport, hotel, taxi...",
        },
        {
            id: 4,
            title: "Food & Dining – Ẩm thực & ăn uống",
            subtitle: "Restaurant, recipe, ingredients...",
        },
        {
            id: 5,
            title: "Health & Fitness – Sức khỏe & thể hình",
            subtitle: "Exercise, nutrition, wellness...",
        },
        {
            id: 6,
            title: "Education – Giáo dục",
            subtitle: "School, university, learning...",
        },
        {
            id: 7,
            title: "Technology – Công nghệ",
            subtitle: "Internet, software, devices...",
        },
        {
            id: 8,
            title: "Shopping – Mua sắm",
            subtitle: "Store, price, discount...",
        },
        {
            id: 9,
            title: "Entertainment – Giải trí",
            subtitle: "Movies, music, games...",
        },
        {
            id: 10,
            title: "Nature & Environment – Thiên nhiên & môi trường",
            subtitle: "Weather, climate, animals...",
        },
        {
            id: 11,
            title: "Family & Relationships – Gia đình & mối quan hệ",
            subtitle: "Parents, siblings, friends...",
        },
        {
            id: 12,
            title: "Money & Finance – Tiền bạc & tài chính",
            subtitle: "Bank, investment, budget...",
        },
        {
            id: 13,
            title: "Housing – Nhà ở",
            subtitle: "Apartment, furniture, rent...",
        },
        {
            id: 14,
            title: "Communication – Giao tiếp",
            subtitle: "Phone, email, social media...",
        },
        {
            id: 15,
            title: "Emotions & Feelings – Cảm xúc",
            subtitle: "Happy, sad, angry...",
        },
        {
            id: 16,
            title: "Hobbies & Interests – Sở thích",
            subtitle: "Reading, painting, sports...",
        },
        {
            id: 17,
            title: "Culture & Traditions – Văn hóa & truyền thống",
            subtitle: "Festivals, customs, heritage...",
        },
        {
            id: 18,
            title: "Social Issues – Vấn đề xã hội",
            subtitle: "Poverty, equality, rights...",
        },
        {
            id: 19,
            title: "Business & Marketing – Kinh doanh & marketing",
            subtitle: "Advertising, sales, strategy...",
        },
        {
            id: 20,
            title: "Jobs & Careers – Nghề nghiệp & định hướng",
            subtitle: "Job search, interviews, career development...",
        },
        {
            id: 21,
            title: "TOEIC Vocabulary – Chủ đề theo TOEIC",
            subtitle: "Business, office routines, travel, marketing, finance...",
        },
        {
            id: 22,
            title: "IELTS Vocabulary – Chủ đề học thuật",
            subtitle: "Education, environment, technology, society, global issues...",
        },
        {
            id: 23,
            title: "Grammar-based Vocabulary – Từ loại, collocations, phrasal verbs",
            subtitle: "Parts of speech, common collocations, phrasal verbs in context...",
        },
    ];

    const handleLevelClick = (topicId, level) => {
        console.log(`Selected Topic ${topicId}, Level ${level}`);
        // Xử lý logic khi người dùng click vào level
        // Ví dụ: navigate(`/vocabulary/${topicId}/${level}`)
    };


    return (
        <div className="vocabulary-page">
            <Header />
            
            <div className="vocabulary-content">
                <div className="vocabulary-header">
                    <h1>Chọn Chủ Đề Từ Vựng</h1>
                    <p>23 Chủ đề quan trọng nhất, từ cấp độ A1 (Cơ bản) đến C2 (Thành thạo).</p>
                </div>

                {/* Chú thích levels - Compact */}
                <div className="levels-legend">
                    <span className="legend-icon">ℹ️</span>
                    <span className="legend-text">Hover vào các cấp độ để xem chi tiết</span>
                    {LEVELS.map((level) => {
                        const info = getLevelInfo(level);
                        return (
                            <div key={level} className="legend-item" title={`${info.name}: ${info.description}`}>
                                <span 
                                    className="legend-badge"
                                    style={{ backgroundColor: getLevelColor(level) }}
                                >
                                    {level}
                                </span>
                                <span className="legend-name">{info.name}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="topics-grid">
                    {topics.map((topic) => (
                        <div key={topic.id} className="topic-card">
                            <div className="topic-number">{topic.id}.</div>
                            <h3 className="topic-title">{topic.title}</h3>
                            <p className="topic-subtitle">{topic.subtitle}</p>
                            
                            <div className="topic-levels">
                                {LEVELS.map((level) => {
                                    const info = getLevelInfo(level);
                                    return (
                                        <button
                                            key={level}
                                            className="level-btn"
                                            style={{ backgroundColor: getLevelColor(level) }}
                                            onClick={() => handleLevelClick(topic.id, level)}
                                            title={`${info.name}: ${info.description}`}
                                        >
                                            {level}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Vocabulary;