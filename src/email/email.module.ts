import { Module } from '@nestjs/common'
import { EmailService } from '@/email/email.service'
import { MailProvider } from '@/email/providers/mailer.provider'

@Module({
  providers: [MailProvider, EmailService],
  exports: [EmailService],
})
export class EmailModule {}