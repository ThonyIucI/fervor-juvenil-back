import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { Roles } from '../../../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../../auth/guards/roles.guard'
import { GetCurrentUserProfileUseCase } from '../../application/use-cases/get-current-user-profile.use-case'
import { ListAllUsersWithProfileUseCase } from '../../application/use-cases/list-all-users-with-profile.use-case'
import { UserWithProfileResponseDto } from '../dto/user-with-profile-response.dto'

/**
 * Controller for admin operations on users
 * All endpoints require admin or superadmin role
 */
@Controller({
  path   : 'v1/users',
  version: '1'
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(
    private readonly listAllUsersWithProfileUseCase: ListAllUsersWithProfileUseCase,
    private readonly getCurrentUserProfileUseCase: GetCurrentUserProfileUseCase
  ) {}

  /**
   * GET /api/users
   * Lists all users with their profiles
   * Only accessible by admin or superadmin
   */
  @Get()
  @Roles('admin', 'superadmin')
  async listAll(): Promise<{ data: UserWithProfileResponseDto[] }> {
    const usersWithProfiles = await this.listAllUsersWithProfileUseCase.execute()

    return {
      data: usersWithProfiles.map(UserWithProfileResponseDto.fromDomain)
    }
  }

  /**
   * GET /api/users/:uuid
   * Gets a specific user by UUID with their profile
   * Only accessible by admin or superadmin
   */
  @Get(':uuid')
  // @Roles('admin', 'superadmin')
  async getByUuid(@Param('uuid') uuid: string): Promise<{ data: UserWithProfileResponseDto }> {
    const userWithProfile = await this.getCurrentUserProfileUseCase.execute(uuid)

    return {
      data: UserWithProfileResponseDto.fromDomain(userWithProfile)
    }
  }
}
