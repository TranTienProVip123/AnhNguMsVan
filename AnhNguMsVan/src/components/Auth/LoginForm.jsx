import PropTypes from 'prop-types';

const LoginForm = ({
  form,
  error,
  globalMsg,
  isLoading,
  onChange,
  onSubmit,
  onForgotPassword
}) => (
  <form onSubmit={onSubmit}>
    <h1>Đăng nhập</h1>

    {globalMsg && <p className="success-text">{globalMsg}</p>}
    {error && <p className="error-text">{error}</p>}

    <div id="googleBtnLogin" className="social-icons" />

    <span>hoặc dùng email và mật khẩu của bạn</span>

    <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
    <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={onChange} required />

    <div className="auth-help-row">
      <button
        type='button'
        className='link-btn'
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword?.();
        }}
      >
        Quên mật khẩu?
      </button>
    </div>
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>
    <p className="verify-hint">Tài khoản mới cần xác thực email trước khi đăng nhập/đổi mật khẩu.</p>
  </form>
);

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  error: PropTypes.string,  //kiem tra prop neu nhap vao la string se bao sai
  globalMsg: PropTypes.string,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func
};

export default LoginForm;
