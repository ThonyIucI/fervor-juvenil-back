import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/**
 * Decorator to specify required roles for accessing an endpoint
 * Used in conjunction with RolesGuard
 *
 * @example
 * @Roles('admin', 'superadmin')
 * @Get('users')
 * async listAllUsers() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
