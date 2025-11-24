import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  mailFrom: process.env.MAIL_FROM || 'huytruongdinh61@gmail.com'
};
