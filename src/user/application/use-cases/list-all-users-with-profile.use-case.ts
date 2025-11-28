import { Inject, Injectable } from '@nestjs/common'

import { SortOrder } from '../../../common/types/pagination.types'
import {
  IUserRepository,
  USER_REPOSITORY
} from '../../domain/repositories/user.repository.interface'
import {
  PaginatedUserResult,
  UserQueryParams
} from '../../domain/types/user-query.types'

/**
 * Use case for listing all users with their profile information
 * This endpoint should only be accessible by admins/superadmins
 *
 * Supports:
 * - Pagination (page, limit)
 * - Sorting by field and order
 * - Filtering by active status
 * - Search by name or email
 *
 * Default behavior: Active users first, sorted by lastName ascending
 */
@Injectable()
export class ListAllUsersWithProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Retrieves paginated users with their profiles
   * @param params - Query parameters (pagination, filters, sorting)
   * @returns Paginated result with users and metadata
   */
  async execute(params?: UserQueryParams): Promise<PaginatedUserResult> {
    // Default params: active users first, sorted by lastName
    const queryParams: UserQueryParams = {
      page     : params?.page ?? 1,
      limit    : params?.limit ?? 10,
      sortBy   : params?.sortBy ?? 'lastName',
      sortOrder: params?.sortOrder ?? SortOrder.ASC,
      isActive : params?.isActive,
      search   : params?.search
    }

    return this.userRepository.findPaginated(queryParams)
  }
}
