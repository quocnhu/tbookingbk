import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/prisma/prisma.service'
import { comparePassword, hashPassword } from '@/common/utils/hash.util'
import { RegisterDto } from '@/auth/dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    // prisma just accepts findUnique, findFirst, findMany, etc. so we can use findUnique with email field since it's unique in the database
    const user = await this.usersService.user.findUnique({
      where: { email },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }

    })

    if (!user) throw new UnauthorizedException()

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
    const hashed = await hashPassword(dto.password)
    //data: because prisma has not had ? we need add all 
    return this.usersService.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashed,
      }

    })
  }
}