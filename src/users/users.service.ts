import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UsersQueryDto } from '@/users/dto/users-query.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: UsersQueryDto) {

    const page = parseInt(String(query.page)) || 1
    const limit = parseInt(String(query.limit)) || 10

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: Number(skip),
        take: Number(limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.user.count(),
    ])

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    })
  }
}