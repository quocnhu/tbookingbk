import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '@/prisma/prisma.service'

const cookieExtractor = (req: any) => {
  return req?.cookies?.token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET',
    })
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    /**
     * Extract role permissions
     */
    const rolePermissions = user.roles.flatMap((r) =>
      r.role.permissions.map((p) => p.permission.name),
    )

    /**
     * Extract direct user permissions
     */
    // const userPermissions = user.permissions.map(
    //   (p) => p.permission.name,
    // )

    /**
     * Merge permissions and remove duplicates
     */
    // const permissions = [
    //   ...new Set([...rolePermissions, ...userPermissions]),
    // ]

    /**
     * Return object attached to request.user
     */
    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      permissions: rolePermissions,
    }
  }
}