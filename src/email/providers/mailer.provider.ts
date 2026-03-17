import { Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from '@/config/mail.config';

export const MailProvider: Provider = {
  provide: 'MAIL_TRANSPORTER',
  useFactory: () => {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });
  },
};