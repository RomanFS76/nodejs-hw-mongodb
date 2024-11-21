import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { env } from './env.js';

const nodemailerConfig = {
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

// const transporter = nodemailer.createTransport({
//     host: env(SMTP.SMTP_HOST),
//     port: Number(env(SMTP.SMTP_PORT)),
//     auth: {
//       user: env(SMTP.SMTP_USER),
//       pass: env(SMTP.SMTP_PASSWORD),
//     },
//   });


// await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
//   });
