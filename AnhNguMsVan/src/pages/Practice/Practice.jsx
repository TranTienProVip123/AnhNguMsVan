import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import bannerPractice from "../../assets/practice_banner.png";
import "./Practice.css";

const Practice = () => {
    const navigate = useNavigate();

    const handleVocabularyClick = () => {
        navigate("/vocabulary");
    };

    const handleListeningClick = () => {
        navigate("/listening");
    };

    return (
        <div className="practice-page">
            <Header />
            <div className="banner-practice-container">
                <img src={bannerPractice} alt="Banner Practice" />
                <div className="banner-practice">
                    <h1>NÂNG CAO KỸ NĂNG TIẾNG ANH CỦA BẠN</h1>
                    <h2>Hàng trăm bài tập từ vựng và nghe hiểu được thiết kế để giúp bạn tiến bộ mỗi ngày.</h2>
                    <button>Bắt Đầu Luyện Tập Ngay →</button>
                </div>
            </div>
        
        <div className="practice-section">
                <h2 className="section-title">Chọn Luyện Tập Kỹ Năng</h2>
                
                <div className="practice-cards">
                    {/* Card Từ Vựng */}
                    <div className="practice-card vocabulary-card" onClick={handleVocabularyClick}>
                        <div className="card-icon vocabulary-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                            </svg>
                        </div>
                        <div className="card-content">
                            <h3>Bài Tập Từ Vựng<br/>(Vocabulary)</h3>
                            <p>Củng cố và mở rộng kho từ vựng tiếng Anh của bạn thông qua 18 chủ đề quan trọng nhất, phân loại theo cấp độ.</p>
                            <button className="practice-btn vocabulary-btn">Luyện Từ Vựng Ngay</button>
                        </div>
                    </div>

                    {/* Card Nghe Hiểu */}
                    <div className="practice-card listening-card" onClick={handleListeningClick}>
                        <div className="card-icon listening-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3C7.03 3 3 7.03 3 12v5c0 1.66 1.34 3 3 3h1c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c0-3.86 3.14-7 7-7s7 3.14 7 7h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h1c1.66 0 3-1.34 3-3v-5c0-4.97-4.03-9-9-9z"/>
                            </svg>
                        </div>
                        <div className="card-content">
                            <h3>Bài Tập Nghe Hiểu<br/>(Listening)</h3>
                            <p>Rèn luyện khả năng nghe và nắm bắt thông tin nhanh chóng với 3 yếu tố: Trình độ, Chủ đề và Kỹ năng chuyên sâu.</p>
                            <button className="practice-btn listening-btn">Luyện Nghe Hiểu Ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}   
export default Practice;