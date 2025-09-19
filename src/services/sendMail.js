import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // TLS için false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (data) => {
  try {
    await transport.sendMail(data);
    console.log('E-posta başarıyla gönderildi!');
  } catch (error) {
    console.error('Nodemailer Hata Detayı:', error); // Hatanın tamamını konsola yazdır
    throw createHttpError(500, 'E-posta gönderme başarısız oldu.');
  }
};

export default sendMail;
