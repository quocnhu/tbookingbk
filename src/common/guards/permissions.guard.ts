import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'

const ACTION_MAP: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  PUT: 'update',
  DELETE: 'delete',
}

@Injectable()
export class PermissionsGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest()
    const user = request.user
    console.log('User permissions:', user?.permissions)

    /**
     * If no user exists, JwtAuthGuard already allowed it (public route)
     */
    if (!user) {
      return true
    }

    /**
     * Extract HTTP method
     */
    const method = request.method
    const action = ACTION_MAP[method]

    if (!action) {
      return true
    }

    /**
     * Extract resource from controller
     * Example: UsersController → users
     */
    const controllerName = context
      .getClass()
      .name.replace('Controller', '')
      .toLowerCase()

    /**
     * Build permission
     */
    const permission = `${controllerName}.${action}`

    /**
     * User permissions from JwtStrategy
     */
    const userPermissions: string[] = user.permissions || []

    const hasPermission = userPermissions.includes(permission)

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing permission: ${permission}`,
      )
    }

    return true
  }
}