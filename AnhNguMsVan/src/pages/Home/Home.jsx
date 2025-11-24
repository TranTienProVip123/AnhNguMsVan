import React, { lazy, Suspense, useState, useEffect } from "react";
import phone from "../../assets/phone.png";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import RoadmapSection from "./RoadmapSection.jsx";
import PlatformSection from "./PlatformSection.jsx";
import ConsultationForm from "./ConsultationForm.jsx";
import "./Home.css";

const StudentGallery = lazy(() => import("./StudentGallery.jsx"));

const Home = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 810);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 810);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const benefits = [
    {
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763544001/plan_i7puss.png",
      title: "Lộ trình học dành riêng cho bạn",
      description: "Mình sẽ hẹn bạn một buổi trò chuyện 1-1 qua google meet để hiểu rõ mục tiêu, định hướng và thời quen học của bạn. Từ đó, mình sẽ thiết kế cho bạn một lộ trình cá nhân hóa, rõ ràng và phù hợp đúng nhu cầu của bạn nhất.",
    },
    {
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763544304/benefit_2_ncfzne.jpg",
      title: "Hỗ trợ 1-1 trong 6 tháng",
      description: "Bạn sẽ được mình đồng hành trọn vẹn suốt 6 tháng, giải đáp mọi thắc mắc trong quá trình học. Bất cứ khi nào cần góp ý bài nói, chính phát âm, hướng dẫn luyện tập hay cần động lực, mình đều có mặt để hỗ trợ. Mục tiêu là giúp bạn học nhẹ nhàng hơn, tự tin hơn và tiến bộ đều theo từng tuần.",
    },
    {
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763544010/book_cgxmsu.jpg",
      title: "Sở hữu khóa học trọn đời",
      description: "Bạn chỉ cần đăng ký một lần là có quyền truy cập khóa học mãi mãi. Tất cả video, tài liệu, bài luyện và cập nhật mới đều thuộc về bạn trọn đời. Khi cần ôn lại, muốn học chăm hơn hay muốn nâng trình vào bất kỳ thời điểm nào, bạn đều có thể mở ra và học lại thoải mái.",
    },
  ];

  const bannerUrl = isMobile
    ? "https://res.cloudinary.com/da6gk23w6/image/upload/v1763804654/banner_Mobile_xahzxr.png"
    : "https://res.cloudinary.com/da6gk23w6/image/upload/v1763543981/bannerMsVan_kmg9k2.png";

  return (
    <div className="home-page">
      <Header />
      
      {/* Banner - GIỮ NGUYÊN */}
      <div className="banner-container">
        <img src={bannerUrl} alt="Banner" className="banner" />
        <div className="banner-content">
          <h2>VỮNG GỐC<br /> PHÁT TRIỂN</h2>
          <p>
            TỰ TIN NÓI TIẾNG ANH
          </p>
        </div>
      </div>

      {/* Benefits - GIỮ NGUYÊN */}
      <div className="benefit">
        <div className="benefit-header">
          <h2>QUYỀN LỢI CỦA HỌC VIÊN KHI</h2>
          <h3>THAM GIA KHÓA HỌC</h3>
        </div>
        <div className="benefit-cards">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-image">
                <img src={benefit.image} alt={benefit.title} />
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap - TÁCH RA */}
      <RoadmapSection />

      {/* Student Gallery - ĐÃ LAZY LOAD */}
      <Suspense fallback={
        <div className="loading-gallery">
          <div className="spinner"></div>
          <p>Đang tải hình ảnh học viên...</p>
        </div>
      }>
        <StudentGallery />
      </Suspense>

      {/* Consultation Form - GIỮ NGUYÊN */}
      <ConsultationForm />

      {/* Platform Section - TÁCH RA */}
      <PlatformSection />

      <Footer />
    </div>
  );
};

export default Home;