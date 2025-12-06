import React, { useState, useRef, useEffect } from "react";
import "./ConsultationForm.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState("success"); // success | error
  const messageTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const showMessage = (message, type = "success", duration = 3000) => {
    setSubmitMessage(message);
    setSubmitType(type);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = duration
      ? setTimeout(() => setSubmitMessage(""), duration)
      : null;
  };

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
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setSubmitMessage("");

    // Validate
    if (!formData.name.trim() || !formData.phone.trim()) {
      showMessage("Vui long dien day du thong tin!", "error");
      setIsSubmitting(false);
      return;
    }

    // Phone validation (Vietnamese format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      showMessage("So dien thoai khong hop le!", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/consultations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          showMessage(data.errors[0].message || "Gui yeu cau that bai.", "error");
        } else {
          showMessage(data.message || "Gui yeu cau that bai.", "error");
        }
        return;
      }

      showMessage("Gui thanh cong! Ms Van se lien he ban som nhat.", "success");
      setFormData({ name: "", phone: "" });
    } catch (error) {
      console.error("Send consultation error:", error);
      showMessage("Co loi xay ra. Vui long thu lai!", "error");
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
                className={`submit-message submit-toast ${submitType}`}
                role="status"
                aria-live="assertive"
              >
                <span className="toast-icon">
                  {submitType === "success" ? "?" : "!"}
                </span>
                <span className="toast-text">{submitMessage}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;