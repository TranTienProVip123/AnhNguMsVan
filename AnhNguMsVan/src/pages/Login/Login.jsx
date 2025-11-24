import { useState } from "react";
import Header from "../../components/Header/Header";
import "./Login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [globalMsg, setGlobalMsg] = useState("");
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      return setError("Mật khẩu nhập lại chưa khớp");
    }

    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:4000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(
          data.message || data.errors?.[0]?.msg || "Đăng ký thất bại"
        );
      }

      setGlobalMsg("Đăng ký thành công, vui lòng đăng nhập.");
      setForm({ email: "", name: "", password: "", confirmPassword: "" });
      setIsRegister(false);
    } catch (err) {
      setError("Không thể kết nối máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className={`auth-container ${isRegister ? "active" : ""}`}>
          <div className="form-container sign-up">
            <form onSubmit={handleRegister}>
              <h1>Tạo tài khoản</h1>

              <div className="social-icons">
                <a
                  href="#"
                  className="icon"
                  onClick={(e) => e.preventDefault()}
                >
                  G
                </a>
              </div>

              <span>hoặc dùng email của bạn để đăng ký</span>
              {error && <p className="error-text">{error}</p>}

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Nhập tên"
                value={form.name}
                onChange={handleChange}
                required
              />

              {/* Mật khẩu */}
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />

              {/* Nhập lại mật khẩu */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          </div>

          {/* FORM SIGN IN */}
          <div className="form-container sign-in">
            <form onSubmit={(e) => e.preventDefault()}>
              <h1>Đăng nhập</h1>

              {globalMsg && <p className="success-text">{globalMsg}</p>}

              <div className="social-icons">
                <a
                  href="#"
                  className="icon"
                  onClick={(e) => e.preventDefault()}
                >
                  G
                </a>
              </div>

              <span>hoặc dùng email và mật khẩu của bạn</span>

              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Mật khẩu" />

              <a href="#">Quên mật khẩu?</a>
              <button type="submit">Đăng nhập</button>
            </form>
          </div>

          {/* TOGGLE PANEL */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Chào mừng trở lại!</h1>
                <p>
                  Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng
                  thông tin cá nhân của bạn.
                </p>
                <button
                  className="hidden"
                  id="login"
                  onClick={() => setIsRegister(false)}
                >
                  Đăng nhập
                </button>
              </div>

              <div className="toggle-panel toggle-right">
                <h1>Xin chào!</h1>
                <p>
                  Nhập thông tin cá nhân và bắt đầu hành trình cùng chúng tôi.
                </p>
                <button
                  className="hidden"
                  id="register"
                  onClick={() => setIsRegister(true)}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
