import { validationResult } from "express-validator";
import { registerUser, loginUser, fetchMe, forgotPass, changePassword, verifyEmailService } from "../services/authService.js"; 

const buildUserPayload = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  let { email, name, password } = req.body;
  email = typeof email === "string" ? email.toLowerCase().trim() : "";

  try {
    const result = await registerUser({ email, name, password });

    if (result.reason === "EMAIL_ALREADY_REGISTERED") {
      return res.status(409).json({
        success: false,
        message: "Email đã được đăng ký.",
      });
    }

    const { user } = result;

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực.",
      data: { user: buildUserPayload(user) },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  try {
    const result = await verifyEmailService({ token });
    if (result.reason === 'INVALID_OR_EXPIRED_TOKEN') {
      return res.status(400).json({
        success: false,
        message: 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.'
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  let { email, password } = req.body;
  email = typeof email === "string" ? email.toLowerCase().trim() : "";

  try {
    // Gọi service xử lý logic
    const result = await loginUser({ email, password });

    // Sai email
    if (result.reason === "USER_NOT_FOUND") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại, vui lòng đăng ký.",
      });
    }

    if (result.reason === 'EMAIL_NOT_VERIFIED') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản chưa được xác thực email. Vui lòng kiểm tra email để xác thực.'
      });
    }

    // Sai mật khẩu
    if (result.reason === "INVALID_PASSWORD") {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
    }

    // Đăng nhập thành công – lấy user, token từ service
    const { user, token } = result;

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      data: {
        user: buildUserPayload(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await fetchMe({ userId: req.user.userId });

    if (result.reason === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    const { user } = result;
    return res.json({
      success: true,
      data: { user: buildUserPayload(user) },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await forgotPass({ email });

    if (result.reason === "EMAIL_NOT_VERIFIED") {
      return res.status(400).json({
        success: false,
        message: "Tài khoản chưa được xác thực email, không thể đặt lại mật khẩu.",
      });
    }

    const { } = result;

    return res.status(200).json({
      success: true,
      message: "Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const result = await changePassword({ token, newPassword });

    if (result.reason === "INVALID_OR_EXPIRED_TOKEN") {
      return res.status(400).json({
        success: false,
        message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    if (result.reason === "PASSWORD_TOO_WEAK") {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không đủ mạnh.",
      });
    }

    const { } = result;

    return res.status(200).json({
      success: true,
      message: "Đặt lai mật khẩu thành công, vui lòng đăng nhập lại.",
    });
  } catch (err) {
    next(err);
  }
};
