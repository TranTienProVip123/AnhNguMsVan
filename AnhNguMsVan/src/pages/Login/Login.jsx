import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, replace } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '', confirmPassword: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [globalMsg, setGlobalMsg] = useState('');
  const globalMsgTimer = useRef();
  const registerErrorTimer = useRef();
  const loginErrorTimer = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!globalMsg) return;
    clearTimeout(globalMsgTimer.current);
    globalMsgTimer.current = setTimeout(() => setGlobalMsg(''), 4000); //sau 4s hide msg
    return () => clearTimeout(globalMsgTimer.current);
  }, [globalMsg]);

  useEffect(() => {
    if (!error) return;
    clearTimeout(registerErrorTimer.current);
    registerErrorTimer.current = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(registerErrorTimer.current);
  }, [error]);

  useEffect(() => {
    if (!loginError) return;
    clearTimeout(loginErrorTimer.current);
    loginErrorTimer.current = setTimeout(() => setLoginError(''), 4000);
    return () => clearTimeout(loginErrorTimer.current);
  }, [loginError]);

  const handleRegisterChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginChange = (e) => {
    setLoginError('');
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    //validate trước khi gửi request
    if (!form.email || !form.name || !form.password || !form.confirmPassword) {
      return setError('Vui lòng điền đầy đủ thông tin.');
    }

    if (form.password.length < 8) {
      return setError('Mật khẩu phải có ít nhất 8 ký tự.');
    }

    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return setError('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số.');
    }

    if (form.password !== form.confirmPassword) {
      return setError('Mật khẩu nhập lại chưa khớp');
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return setError(data.message || data.errors?.[0]?.msg || 'Đăng ký thất bại');
      }

      setGlobalMsg('Đăng ký thành công, vui lòng đăng nhập.');
      setForm({ email: '', name: '', password: '', confirmPassword: '' });
      setIsRegister(false);
    } catch (err) {
      setError('Không thể kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      setLoginLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return setLoginError(data.message || data.errors?.[0]?.msg || 'Đăng nhập thất bại');
      }

      login(data); //cap nhat context va localStorage

      if (data?.data?.user?.role  === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const redirectPath = location.state?.from || "/";
        navigate(redirectPath, { replace: true });
      }
      
      setLoginForm({ email: '', password: '' });

    } catch (err) {
      setLoginError('Không thể kết nối máy chủ');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className={`auth-container ${isRegister ? 'active' : ''}`}>
        <div className="form-container sign-up">
          <RegisterForm
            form={form}
            error={error}
            isLoading={isLoading}
            onChange={handleRegisterChange}
            onSubmit={handleRegister}
          />
        </div>

        <div className="form-container sign-in">
          <LoginForm
            form={loginForm}
            error={loginError}
            globalMsg={globalMsg}
            isLoading={loginLoading}
            onChange={handleLoginChange}
            onSubmit={handleLogin}
          />
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Chào mừng trở lại!</h1>
              <p>Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn.</p>
              <button className="hidden" id="login" onClick={() => setIsRegister(false)}>
                Đăng nhập
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Xin chào!</h1>
              <p>Nhập thông tin cá nhân và bắt đầu hành trình cùng chúng tôi.</p>
              <button className="hidden" id="register" onClick={() => setIsRegister(true)}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
