import React, { useState } from "react";
import "./ConsultationForm.css";

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Validate
    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitMessage("Vui lòng điền đầy đủ thông tin!");
      setIsSubmitting(false);
      return;
    }

    // Phone validation (Vietnamese format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      setSubmitMessage("Số điện thoại không hợp lệ!");
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Gửi dữ liệu đến server/API
      // const response = await fetch('/api/consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Giả lập gửi form
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitMessage("✓ Gửi thành công! Ms Vân sẽ liên hệ bạn sớm nhất.");
      setFormData({ name: "", phone: "" });
    } catch (error) {
      setSubmitMessage("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consultation-form-section">
      <div className="consultation-container">
        {/* Left Side - Image & Info */}
        <div className="consultation-left">
          <div className="consultation-badge">
            <h3>HÌNH THỨC HỌC <span className="highlight">ONLINE</span></h3>
            <p>Học qua google meet linh hoạt mọi nơi</p>
          </div>

          <div className="teacher-image">
            <img
              src="https://res.cloudinary.com/da6gk23w6/image/upload/v1763703545/img2_l4v9lm.jpg"
              alt="Ms Vân - Giáo viên Tiếng Anh"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="consultation-right">
          <div className="form-header">
            <div className="header-icon">🎓</div>
            <h2>Nhận Tư Vấn Lộ Trình</h2>
            <h3>Miễn Phí</h3>
          </div>

          <div className="form-benefits">
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <p>Đăng ký tư vấn, xây dựng lộ trình học tiếng Anh hiệu quả.</p>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <p>Kiểm tra trình độ miễn phí</p>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <p>Thiết kế lộ trình học riêng biệt</p>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <p>Giải đáp thắc mắc về khóa học</p>
            </div>
          </div>

          <form className="consultation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên:"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại:"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  ĐANG GỬI...
                </>
              ) : (
                "GỬI YÊU CẦU TƯ VẤN"
              )}
            </button>

            {submitMessage && (
              <div
                className={`submit-message ${
                  submitMessage.includes("✓") ? "success" : "error"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;