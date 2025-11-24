import sgMail from '@sendgrid/mail';
import { config } from '../config/config.js';

sgMail.setApiKey(config.sendgridApiKey);

export const sendVerificationEmail = async ({ to, token }) => {
  const verifyUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const msg = {
    to,
    from: config.mailFrom,
    subject: 'Xác thực email tài khoản',
    text: `Nhấn vào link sau để xác thực: ${verifyUrl}`,
    html: `<p>Nhấn vào link sau để xác thực:</p><a href="${verifyUrl}">${verifyUrl}</a>`
  };
  await sgMail.send(msg);
};

export const sendResetPasswordEmail = async ({ to, token }) => {
  const resetUrl = `${config.clientUrl}/reset-password/${token}`;
  const msg = {
    to,
    from: config.mailFrom,
    subject: 'Đặt lại mật khẩu',
    text: `Nhấn vào link sau để đặt lại mật khẩu: ${resetUrl}`,
    html: `<p>Nhấn vào link sau để đặt lại mật khẩu:</p><a href="${resetUrl}">${resetUrl}</a>`
  };
  await sgMail.send(msg);
};
