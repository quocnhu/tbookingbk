import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common'

import { UsersService } from '@/users/users.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UsersQueryDto } from '@/users/dto/users-query.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users?page=1&limit=10
   *  @Get(profile) will query to /users/profile, but we want to query to /users with query params, so we just use @Get() without any path
   */
  @Get()
  findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query)
  }

  /**
   * POST /users
   */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}