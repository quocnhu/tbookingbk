import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common'
import type { Response } from 'express' // this fixes the type error for res object, you can also use @types/express package

import { AuthService } from '@/auth/auth.service'
import { Public } from '@/common/decorators/public.decorator'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(
      body.email,
      body.password,
    )

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    })

    return { message: 'login success' }
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log(dto)
    return this.authService.register(dto)
  }
}