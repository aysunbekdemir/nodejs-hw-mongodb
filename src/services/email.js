import { env } from '../utils/env.js';

// Geçici olarak email servisini mock edin
export const sendEmail = async (options) => {
  console.log('Email gönderildi (mock):', options);
  return { message: 'Email sent successfully (mock)' };
};
