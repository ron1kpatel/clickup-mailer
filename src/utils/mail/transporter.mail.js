import nodemailer from 'nodemailer';
import { EMAIL_ID, EMAIL_PASSWORD } from './config.mail.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;