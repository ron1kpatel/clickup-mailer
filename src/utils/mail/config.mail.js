import dotenv from 'dotenv';

dotenv.config({
  path: './src/.env'
});

export const EMAIL_ID = process.env.EMAIL_ID;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;