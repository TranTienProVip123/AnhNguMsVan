import PropTypes from "prop-types";
import { useState } from "react";
import "./ResetPasswordModal.css";

const ResetPasswordModal = ({ email, onClose, apiBaseUrl }) => {
  const [userEmail, setUserEmail] = useState(email || "");
  const [step, setStep] = useState("request"); // request -> reset
  const [form, setForm] = useState({ code: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setError("");
    setMsg("");
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi mã thất bại");
      }
      setMsg("Đã gửi mã về email. Vui lòng kiểm tra hộp thư.");
      setStep("reset");
    } catch (err) {
      setError(err.message || "Gửi mã thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!form.code || !form.newPassword) {
      return setError("Vui lòng nhập mã và mật khẩu mới.");
    }
    if (form.newPassword.length < 6) {
      return setError("Mật khẩu tối thiểu 6 ký tự.");
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }
      setMsg("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-modal-backdrop">
      <div className="reset-modal">
        <div className="reset-modal-header">
          <h3>Đổi mật khẩu</h3>
          <button onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <p className="reset-desc">Nhập email để nhận mã, sau đó tạo mật khẩu mới.</p>

        <div className="reset-body">
          <label className="reset-label">Email</label>
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Nhập email của bạn để nhận mã"
          />

          {step === "request" && (
            <button className="primary-btn" onClick={handleSendCode} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã về email"}
            </button>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="reset-form">
              <label className="reset-label">Mã xác nhận</label>
              <input
                name="code"
                placeholder="Nhập mã 6 ký tự trong gmail"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              />
              <label className="reset-label">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={form.newPassword}
                onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Đang đổi..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}

          {msg && <p className="reset-success">{msg}</p>}
          {error && <p className="reset-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

ResetPasswordModal.propTypes = {
  email: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  apiBaseUrl: PropTypes.string.isRequired,
};

export default ResetPasswordModal;
