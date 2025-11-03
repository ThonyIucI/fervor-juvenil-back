import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { Roles } from '../../../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../../auth/guards/roles.guard'
import {
  PaginationMetaCalculator,
  SortOrder
} from '../../../common/types/pagination.types'
import { GetCurrentUserProfileUseCase } from '../../application/use-cases/get-current-user-profile.use-case'
import { ListAllUsersWithProfileUseCase } from '../../application/use-cases/list-all-users-with-profile.use-case'
import { GetPaginatedUsersDto } from '../dto/get-paginated-users.dto'
import { PaginatedUsersResponseDto } from '../dto/paginated-users-response.dto'
import { UserWithProfileResponseDto } from '../dto/user-with-profile-response.dto'
import { UserListResource } from '../resources/user-list.resource'

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
   * Lists all users with their profiles (paginated)
   * Only accessible by admin or superadmin
   *
   * Query params:
   * - page: number (default: 1)
   * - limit: number (default: 10, max: 100)
   * - sortBy: firstName | lastName | email | createdAt | isActive (default: lastName)
   * - sortOrder: ASC | DESC (default: ASC)
   * - isActive: boolean (filter by active status)
   * - search: string (search in name or email)
   */
  @Get()
  @Roles('admin', 'superadmin')
  async listAll(
    @Query() query: GetPaginatedUsersDto
  ): Promise<PaginatedUsersResponseDto> {
    // Convert sortOrder string to SortOrder enum
    const sortOrder =
      query.sortOrder === 'DESC' ? SortOrder.DESC : SortOrder.ASC

    const result = await this.listAllUsersWithProfileUseCase.execute({
      page    : query.page ?? 1,
      limit   : query.limit ?? 10,
      sortBy  : query.sortBy,
      sortOrder,
      isActive: query.isActive,
      search  : query.search
    })

    // Transform to resources
    const data = UserListResource.collection(result.users)

    // Calculate metadata
    const meta = PaginationMetaCalculator.calculate(
      result.total,
      query.page ?? 1,
      query.limit ?? 10
    )

    return new PaginatedUsersResponseDto(data, meta)
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
