import { Inject, Injectable } from '@nestjs/common'
import type { Transporter } from 'nodemailer'
import { mailConfig } from '@/config/mail.config'

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: Transporter,
  ) {}

  async sendVerificationEmail(email: string, token: string) {
    const verifyLink = `http://localhost:3000/auth/verify?token=${token}`

    const html = `
      <h2>Email Verification</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
      <p>This link expires in 1 hour.</p>
    `

    await this.transporter.sendMail({
      from: `"MyApp" <${mailConfig.user}>`,
      to: email,
      subject: 'Verify your email',
      html,
    })
  }
}