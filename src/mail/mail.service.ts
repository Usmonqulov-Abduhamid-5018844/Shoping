import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: String(process.env.MEIL_FROM),
        pass: String(process.env.MEIL_PASS),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const message = await this.transporter.sendMail({

        from: String(process.env.MEIL_FROM),
        to,
        subject,
        html: text
       
      });
      return message;
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      return catchError(error);
    }
  }
}
