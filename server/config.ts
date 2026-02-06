import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-email-password',
    from: process.env.EMAIL_FROM || 'your-email@gmail.com',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/community_hub',
  },
} as const;

export default config;
