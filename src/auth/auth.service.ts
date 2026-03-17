import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/prisma/prisma.service'
import { comparePassword, hashPassword } from '@/common/utils/hash.util'
import { RegisterDto } from '@/auth/dto/register.dto'
import { EmailService } from '@/email/email.service'
import { randomBytes, createHash } from 'crypto'
@Injectable()
export class AuthService {
  constructor(
    private usersService: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async login(email: string, password: string) {
    const user = await this.usersService.user.findUnique({
      where: { email },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) throw new UnauthorizedException()

    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified')
    }

    const valid = await comparePassword(password, user.password)

    if (!valid) throw new UnauthorizedException()

    const payload = {
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
    }

    return this.jwtService.sign(payload)
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await hashPassword(dto.password)

    const user = await this.usersService.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      },
    })

    // 🔑 generate raw token (send to user)
    const rawToken = randomBytes(32).toString('hex')

    // 🔒 hash token (store in DB)
    const hashedToken = createHash('sha256')
      .update(rawToken)
      .digest('hex')

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await this.usersService.verificationToken.create({
      data: {
        token: hashedToken, // store hashed version
        userId: user.id,
        expiresAt,
      },
    })

    // 📧 send RAW token
    await this.emailService.sendVerificationEmail(user.email, rawToken)

    return {
      message: 'User created. Please verify your email.',
    }
  }

  async verifyEmail(token: string) {
    // 🔒 hash incoming token to compare with DB
    const hashedToken = createHash('sha256')
      .update(token)
      .digest('hex')

    const record = await this.usersService.verificationToken.findUnique({
      where: { token: hashedToken },
    })

    if (!record) {
      throw new BadRequestException('Invalid token')
    }

    // ⏰ check expiration
    if (record.expiresAt < new Date()) {
      throw new BadRequestException('Token expired')
    }

    await this.usersService.user.update({
      where: { id: record.userId },
      data: { isVerified: true },
    })

    // 🧹 delete token after use
    await this.usersService.verificationToken.delete({
      where: { token: hashedToken },
    })

    return { message: 'Email verified successfully' }
  }

}