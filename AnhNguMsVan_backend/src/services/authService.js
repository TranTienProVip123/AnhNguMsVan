import { OAuth2Client } from 'google-auth-library'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { config } from "../config/config.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "./emailService.js";

const googleClient = new OAuth2Client(config.googleClientId);

export const registerUser = async ({ email, name, password }) => {
    const existing = await User.findOne({ email });

    //kiem tra email da duoc dang ky chua
    if (existing) {
        return { reason: "EMAIL_ALREADY_REGISTERED" };
    }

    // Tao user moi va hash mat khau sau do luu vao db
    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // ma xac thuc 6 so
    const codeHashed = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.create({
        email,
        name,
        password: hashed,
        isVerified: false,
        emailVerificationToken: codeHashed,
        emailVerificationExpires: Date.now() + 15 * 60 * 1000
    });

    //gui email xac thuc
    await sendVerificationEmail({ to: email, code });
    return { user };
};

export const verifyEmailService = async ({ email, code }) => {
    const hashed = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({
        email,
        emailVerificationToken: hashed,
        emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) {
        return { reason: "INVALID_OR_EXPIRED_TOKEN" };
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return { user };
};

export const resendVerifyCode = async ({ email }) => {
    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return { reason: "USER_NOT_FOUND" };
    if (user.isVerified) return { reason: "ALREADY_VERIFIED" };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHashed = crypto.createHash('sha256').update(code).digest('hex');

    user.emailVerificationToken = codeHashed;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail({ to: user.email, code });
    return {};
};

export const loginUser = async ({ email, password }) => {
    // Tìm user theo email
    const user = await User.findOne({ email });

    if (!user) {
        // dùng reason để controller biết lỗi gì
        return { reason: "USER_NOT_FOUND" };
    }

    if (!user.isVerified) return { reason: 'EMAIL_NOT_VERIFIED' };

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { reason: "INVALID_PASSWORD" };
    }

    // Tạo token nếu mật khẩu đúng
    const token = jwt.sign(
        {
            userId: user._id,
            pwdChangedAt: user.passwordChangedAt?.getTime() || 0,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    return { user, token };
};

export const fetchMe = async ({ userId }) => {
    const user = await User.findById(userId).select('_id email name role passwordChangedAt authProvider avatar');

    if (!user) {
        return { reason: "USER_NOT_FOUND" };
    }

    return { user };
};

export const forgotPass = async ({ email }) => {
    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return {};

    if (!user.isVerified) return { reason: 'EMAIL_NOT_VERIFIED' };

    const rawCode = Math.floor(100000 + Math.random() * 900000).toString(); //mã 6 số đổi mk
    const hashedCode = crypto.createHash("sha256").update(rawCode).digest("hex");

    user.passwordResetToken = hashedCode;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail({ to: user.email, token: rawCode });

    return {};
};

export const changePassword = async ({ code, newPassword }) => {
    if (!code) {
        return { reason: "INVALID_OR_EXPIRED_TOKEN" };
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return { reason: "INVALID_OR_EXPIRED_TOKEN" };
    }

    if (!newPassword || newPassword.length < 6) {
        return { reason: "PASSWORD_TOO_WEAK" };
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save({ validateBeforeSave: false });

    return {};
};

export const loginWithGoogle = async ({ idToken }) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload.email?.toLowerCase().trim();
    const name = payload.name || email?.split('@')[0] || 'Google User';
    const avatar = payload.picture;

    if (!email) return { reason: 'INVALID_GOOGLE_TOKEN' };

    let user = await User.findOne({ email });

    if (!user) {
        const tempPassword = crypto.randomBytes(16).toString('hex'); //mat khau tam
        const hashed = await bcrypt.hash(tempPassword, 10);
        user = await User.create({
            email,
            name,
            password: hashed,
            isVerified: true,
            role: 'user',
            authProvider: 'google',
            avatar,
        });
    } else {
        if (!user.isVerified) user.isVerified = true;
        // cập nhật avatar nếu chưa có hoặc là user Google
        if (avatar && (!user.avatar || user.authProvider === 'google')) {
            user.avatar = avatar;
        }
        if (!user.authProvider) user.authProvider = 'google';
        await user.save();
    }

    const token = jwt.sign(
        { userId: user._id, pwdChangedAt: user.passwordChangedAt?.getTime() || 0 },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    return { user, token };
};
