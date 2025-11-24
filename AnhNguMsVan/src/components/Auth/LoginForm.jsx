import PropTypes from 'prop-types';

const LoginForm = ({
  form,
  error,
  globalMsg,
  isLoading,
  onChange,
  onSubmit
}) => (
  <form onSubmit={onSubmit}>
    <h1>Đăng nhập</h1>

    {globalMsg && <p className="success-text">{globalMsg}</p>}
    {error && <p className="error-text">{error}</p>}

    <div className="social-icons">
      <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
        G
      </a>
    </div>

    <span>hoặc dùng email và mật khẩu của bạn</span>

    <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
    <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={onChange} required />

    <a href="#">Quên mật khẩu?</a>
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>
  </form>
);

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  error: PropTypes.string,  //kiem tra prop neu nhap vao la string se bao sai
  globalMsg: PropTypes.string,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
