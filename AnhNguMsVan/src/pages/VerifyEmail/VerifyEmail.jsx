import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./VerifyEmail.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const VerifyEmail = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [location.search, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!email || !code) return setError("Vui lòng nhập email và mã xác nhận.");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Xác thực thất bại");
      }
      setMsg("Xác thực email thành công. Bạn có thể đăng nhập.");
      setEmail("");
      setCode("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Xác thực thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMsg("");
    if (!email) return setError("Vui lòng nhập email để gửi lại mã.");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi lại mã thất bại");
      }
      setMsg("Đã gửi lại mã xác thực. Kiểm tra hộp thư.");
    } catch (err) {
      setError(err.message || "Gửi lại mã thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="verify-page">
        <div className="verify-card">
          <h1>Xác thực email</h1>
          <p>Nhập email và mã 6 số đã được gửi tới hộp thư của bạn.</p>
          <form onSubmit={handleSubmit} className="verify-form">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            <label>Mã xác nhận</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Mã 6 số"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>
            <button type="button" className="ghost-btn" onClick={handleResend} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          </form>
          {msg && <p className="verify-success">{msg}</p>}
          {error && <p className="verify-error">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
