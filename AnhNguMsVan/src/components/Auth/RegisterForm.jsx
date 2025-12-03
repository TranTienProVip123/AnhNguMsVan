import PropTypes from 'prop-types';

const RegisterForm = ({
  form,
  error,
  isLoading,
  onChange,
  onSubmit
}) => (
  <form onSubmit={onSubmit}>
    <h1>Tạo tài khoản</h1>

    <div id="googleBtnRegister" className="social-icons" />

    <span>hoặc dùng email của bạn để đăng ký</span>
    {error && <p className="error-text">{error}</p>}

    <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
    <input type="text" name="name" placeholder="Nhập tên" value={form.name} onChange={onChange} required />
    <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={onChange} required />
    <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={onChange} required />

    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
    </button>
  </form>
);

RegisterForm.propTypes = {
  form: PropTypes.object.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default RegisterForm;
