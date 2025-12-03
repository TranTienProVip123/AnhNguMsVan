import { validationResult } from "express-validator";
import {
  registerUser,
  loginUser,
  fetchMe,
  forgotPass,
  changePassword,
  verifyEmailService,
  loginWithGoogle,
  resendVerifyCode
} from "../services/authService.js";

const buildUserPayload = (user) => ({
  id: user._id,
  email: user.email,
  avatar: user.avatar,
  name: user.name,
  role: user.role,
  authProvider: user.authProvider,
  passwordChangedAt: user.passwordChangedAt
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
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: "Thiếu email hoặc mã" });
  try {
    const result = await verifyEmailService({ email: email.toLowerCase().trim(), code });
    if (result.reason === 'INVALID_OR_EXPIRED_TOKEN') {
      return res.status(400).json({ success: false, message: 'Mã không hợp lệ hoặc đã hết hạn.' });
    }
    return res.status(200).json({ success: true, message: 'Xác thực email thành công.' });
  } catch (err) {
    next(err);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Thiếu email" });
  try {
    const result = await resendVerifyCode({ email });
    if (result.reason === "USER_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Email không tồn tại." });
    }
    if (result.reason === "ALREADY_VERIFIED") {
      return res.status(400).json({ success: false, message: "Email đã được xác thực." });
    }
    return res.status(200).json({ success: true, message: "Đã gửi lại mã xác thực." });
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
    const result = await loginUser({ email, password });

    if (result.reason === "USER_NOT_FOUND") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại, vui lòng đăng ký.",
      });
    }

    if (result.reason === 'EMAIL_NOT_VERIFIED') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản chưa xác thực email. Vui lòng kiểm tra email để xác thực.'
      });
    }

    if (result.reason === "INVALID_PASSWORD") {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
    }

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
        message: "Tài khoản chưa xác thực email, không thể đặt lại mật khẩu.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { code, newPassword } = req.body;

  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã xác nhận.",
      });
    }

    const result = await changePassword({ code, newPassword });

    if (result.reason === "INVALID_OR_EXPIRED_TOKEN") {
      return res.status(400).json({
        success: false,
        message: "Mã không hợp lệ hoặc đã hết hạn.",
      });
    }

    if (result.reason === "PASSWORD_TOO_WEAK") {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không đủ mạnh.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công, vui lòng đăng nhập lại.",
    });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Thiếu idToken' });
    }

    const result = await loginWithGoogle({ idToken });
    if (result.reason === 'INVALID_GOOGLE_TOKEN') {
      return res.status(401).json({ success: false, message: 'Token Google không hợp lệ' });
    }

    const { user, token } = result;
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập Google thành công',
      data: { user: { id: user._id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, authProvider: user.authProvider }, token }
    });
  } catch (err) {
    next(err);
  }
};
