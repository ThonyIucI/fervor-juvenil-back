import { PaginationMeta } from '../../../common/types/pagination.types'
import { UserListResource } from '../resources/user-list.resource'

/**
 * DTO de respuesta paginada de usuarios
 */
export class PaginatedUsersResponseDto {
  data: UserListResource[]
  meta: PaginationMeta

  constructor(data: UserListResource[], meta: PaginationMeta) {
    this.data = data
    this.meta = meta
  }
}
