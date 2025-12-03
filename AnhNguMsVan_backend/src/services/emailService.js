import sgMail from '@sendgrid/mail';
import { config } from '../config/config.js';

sgMail.setApiKey(config.sendgridApiKey);

export const sendVerificationEmail = async ({ to, code }) => {
  const msg = {
    to,
    from: config.mailFrom,
    subject: 'Mã xác thực email',
    text: `Mã xác thực của bạn: ${code}. Hiệu lực 15 phút.`,
    html: `<p>Mã xác thực của bạn:</p><h2>${code}</h2><p>Hiệu lực 15 phút.</p>`
  };
  await sgMail.send(msg);
};

export const sendResetPasswordEmail = async ({ to, token }) => {
  const msg = {
    to,
    from: config.mailFrom,
    subject: 'Mã đặt lại mật khẩu',
    text: `Mã đặt lại mật khẩu của bạn là: ${token}. Mã có hiệu lực 15 phút.`,
    html: `<p>Mã đặt lại mật khẩu của bạn:</p><h2>${token}</h2><p>Mã có hiệu lực 15 phút.</p>`
  };
  await sgMail.send(msg);
};
