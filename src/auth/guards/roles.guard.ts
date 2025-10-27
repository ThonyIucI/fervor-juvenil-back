import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if(!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if(!user) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso')
    }

    // TODO: Check user roles when role system is implemented
    // For now, we'll check if user has roles property
    const userRoles = user.roles || []
    const hasRole = requiredRoles.some((role) => userRoles.includes(role))

    if(!hasRole) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso')
    }

    return true
  }
}
