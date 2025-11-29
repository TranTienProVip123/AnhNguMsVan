// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../../../components/Header/Header.jsx";
// import { getLevelColor, getLevelInfo } from "../Vocabulary/Levels.jsx";
// import "./Listening.css";

// const Listening = () => {
//   const navigate = useNavigate();
//   const [selectedLevel, setSelectedLevel] = useState("B1");
//   const [selectedSkill, setSelectedSkill] = useState("Listening for Gist");
//   const [selectedTopic, setSelectedTopic] = useState("Education");
//   const [showLevelGuide, setShowLevelGuide] = useState(false);

//   const skills = [
//     {
//       id: "gist",
//       name: "Listening for Gist",
//       icon: "💡",
//       description:
//         "Nghe để hiểu được ý chính, chủ đề bao quát của đoạn hội thoại hoặc bài nói.",
//     },
//     {
//       id: "details",
//       name: "Listening for Details",
//       icon: "🔍",
//       description:
//         "Nghe để nắm bắt các thông tin chi tiết cụ thể (tên, số, ngày tháng, địa điểm).",
//     },
//     {
//       id: "keywords",
//       name: "Listening for Keywords",
//       icon: "🔑",
//       description:
//         "Tập trung vào các từ khóa quan trọng để xác định ý nghĩa và nội dung chính xác.",
//     },
//     {
//       id: "inference",
//       name: "Listening for Inference",
//       icon: "🧠",
//       description:
//         "Nghe và suy luận, đoán ý, hiểu hàm ý của người nói thường gặp trong IELTS.",
//     },
//     {
//       id: "pronunciation",
//       name: "Listening for Pronunciation",
//       icon: "💬",
//       description:
//         "Luyện phân biệt các âm thanh tương tự nhau (Minimal Pairs: sheep/ship, rice/lice).",
//     },
//     {
//       id: "connected",
//       name: "Listening for Connected Speech",
//       icon: "🔗",
//       description:
//         "Tập trung vào nối âm, nuốt âm, âm yếu (giọng tự nhiên và giao tiếp lớt hơn).",
//     },
//   ];

//   const topics = [
//     "Daily Life",
//     "Travel",
//     "Restaurant",
//     "Work / Office",
//     "Education",
//     "Technology",
//     "Shopping",
//     "Health",
//     "Weather",
//     "Social Media",
//     "Culture",
//     "TOEIC topics",
//     "IELTS topics",
//   ];

//   const handleStartPractice = () => {
//     console.log("Start Practice:", {
//       selectedLevel,
//       selectedSkill,
//       selectedTopic,
//     });
//     navigate(
//       `/listening/quiz/${selectedLevel}/${selectedSkill}/${selectedTopic}`
//     );
//   };

//   const handleBackToPractice = () => {
//     navigate("/practice");
//   };

//   return (
//     <>
//       <Header />

//       <div className="listening-page">
//         <div className="listening-content">
//           <div className="listening-header">
//             <h1>Luyện Nghe Hiểu</h1>
//             <p>Chọn trình độ, kỹ năng và chủ đề để bắt đầu luyện tập</p>
//           </div>

//           {/* Step 1: Chọn Trình Độ */}
//           <div className="step-section">
//             <div className="step-header">
//               <span className="step-number">1</span>
//               <h2>Chọn Trình Độ (Level)</h2>
//               <button
//                 className="info-btn"
//                 onClick={() => setShowLevelGuide(true)}
//                 title="Xem hướng dẫn các cấp độ"
//               >
//                 ℹ️Xem hướng dẫn các cấp độ (CEFR)
//               </button>
//             </div>
//             <div className="levels-container">
//               {LEVELS.map((level) => {
//                 const info = getLevelInfo(level);
//                 return (
//                   <button
//                     key={level}
//                     className={`level-option ${
//                       selectedLevel === level ? "active" : ""
//                     }`}
//                     style={{
//                       backgroundColor:
//                         selectedLevel === level ? getLevelColor(level) : "#fff",
//                       borderColor: getLevelColor(level),
//                       color:
//                         selectedLevel === level ? "#fff" : getLevelColor(level),
//                     }}
//                     onClick={() => setSelectedLevel(level)}
//                     title={`${info.name}: ${info.description}`}
//                   >
//                     {level}
//                   </button>
//                 );
//               })}
//             </div>
//             <p className="selected-info">
//               Trình độ đang chọn: <strong>{selectedLevel}</strong>
//             </p>
//           </div>

//           {/* Modal hướng dẫn levels */}
//           {showLevelGuide && (
//             <div
//               className="level-guide-modal"
//               onClick={() => setShowLevelGuide(false)}
//             >
//               <div
//                 className="modal-content"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="modal-header">
//                   <h3>📚 Hướng dẫn các cấp độ (CEFR)</h3>
//                   <button
//                     className="close-btn"
//                     onClick={() => setShowLevelGuide(false)}
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   {LEVELS.map((level) => {
//                     const info = getLevelInfo(level);
//                     return (
//                       <div key={level} className="level-guide-item">
//                         <div
//                           className="level-badge"
//                           style={{ backgroundColor: getLevelColor(level) }}
//                         >
//                           {level}
//                         </div>
//                         <div className="level-info">
//                           <h4>{info.name}</h4>
//                           <p>{info.description}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Chọn Kỹ Năng */}
//           <div className="step-section">
//             <div className="step-header">
//               <span className="step-number">2</span>
//               <h2>Chọn Kỹ Năng Nghe Chuyên Sâu</h2>
//             </div>
//             <div className="skills-grid">
//               {skills.map((skill) => (
//                 <div
//                   key={skill.id}
//                   className={`skill-card ${
//                     selectedSkill === skill.name ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedSkill(skill.name)}
//                 >
//                   <div className="skill-icon">{skill.icon}</div>
//                   <h3>{skill.name}</h3>
//                   <p>{skill.description}</p>
//                 </div>
//               ))}
//             </div>
//             <p className="selected-info">
//               Kỹ năng đang chọn: <strong>{selectedSkill}</strong>
//             </p>
//           </div>

//           {/* Step 3: Chọn Chủ Đề */}
//           <div className="step-section">
//             <div className="step-header">
//               <span className="step-number">3</span>
//               <h2>Chọn Chủ Đề</h2>
//             </div>
//             <div className="topics-container">
//               {topics.map((topic) => (
//                 <button
//                   key={topic}
//                   className={`topic-option ${
//                     selectedTopic === topic ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedTopic(topic)}
//                 >
//                   {topic}
//                 </button>
//               ))}
//             </div>
//             <p className="selected-info">
//               Chủ đề đang chọn: <strong>{selectedTopic}</strong>
//             </p>
//           </div>

//           {/* Start Button */}
//           <div className="action-buttons">
//             <button
//               className="start-practice-btn"
//               onClick={handleStartPractice}
//             >
//               BẮT ĐẦU LUYỆN NGHE →
//             </button>
//             <p className="practice-info">
//               Bài tập: <strong>{selectedLevel}</strong> |{" "}
//               <strong>{selectedSkill}</strong> |{" "}
//               <strong>{selectedTopic}</strong>
//             </p>
//           </div>

//           {/* Back Button */}
//           <div className="back-button-container">
//             <button
//               className="back-to-practice-btn"
//               onClick={handleBackToPractice}
//             >
//               <span className="back-icon">←</span>
//               <span>Quay lại Trang Chủ</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Listening;
