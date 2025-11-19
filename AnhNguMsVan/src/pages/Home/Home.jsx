import React from "react";
import { Link } from "react-router-dom";
import banner from "../../assets/bannerMsVan.png";
import phone from "../../assets/phone.png";
import Header from "../../components/Header/Header.jsx";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="banner-container">
        <img src={banner} alt="Banner" className="banner" />
        <div className="banner-content">
          <h2>VỮNG CHẮC NỀN TẢNG</h2>
          <p>
            Chào bạn, Cô là Vân - Giáo viên Tiếng Anh Chuyên Lấy Gốc cho người mới
            bắt đầu. Luyện tập cùng cô mỗi ngày, bạn sẽ: Vững ngữ pháp, Chuẩn phát
            âm, Tự tin giao tiếp.
          </p>
          <div className="info-contact">
            <img src={phone} alt="Phone" className="phone" />
            <h3>Contact for registering <br /> 0569 551 216</h3>
          </div>
        </div>
      </div>

      <div className="benefit">
        <h2>ƯU ĐIỂM KHI HỌC CÙNG CÔ VÂN</h2>
        <ul>
          <li>Giáo trình chuẩn quốc tế, bài tập thực hành đa dạng</li>
          <li>Phương pháp học tập hiệu quả, dễ nhớ, dễ áp dụng</li>
          <li>Hỗ trợ học viên 24/7 qua nhóm cộng đồng riêng</li>
          <li>Cơ hội nhận chứng chỉ hoàn thành khóa học</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;