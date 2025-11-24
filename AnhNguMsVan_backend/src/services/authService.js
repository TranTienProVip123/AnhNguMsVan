import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { config } from "../config/config.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "./emailService.js";

export const registerUser = async ({ email, name, password }) => {
    const existing = await User.findOne({ email });

    //kiem tra email da duoc dang ky chua
    if (existing) {
        return { reason: "EMAIL_ALREADY_REGISTERED" };
    }

    // Tao user moi va hash mat khau sau do luu vao db
    const hashed = await bcrypt.hash(password, 10);
    const verificationTokenRaw = crypto.randomBytes(32).toString('hex');
    const verificationTokenHashed = crypto
        .createHash('sha256')
        .update(verificationTokenRaw)
        .digest('hex');

    const user = await User.create({
        email,
        name,
        password: hashed,
        isVerified: false,
        emailVerificationToken: verificationTokenHashed,
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    //gui email xac thuc
    await sendVerificationEmail({ to: email, token: verificationTokenRaw });
    return { user };
};

export const verifyEmailService = async ({ token }) => {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
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
    const user = await User.findById(userId).select('_id email name role passwordChangedAt');

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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail({ to: user.email, token: resetToken });

    return {};
};

export const changePassword = async ({ token, newPassword }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
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
