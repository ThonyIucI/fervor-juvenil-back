import {
  PaginationParams,
  SearchParams,
  SortParams
} from '../../../common/types/pagination.types'
import { UserWithProfile } from '../repositories/user.repository.interface'

/**
 * Campos por los que se puede ordenar usuarios
 */
export type UserSortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'createdAt'
  | 'isActive'
  | 'dni'

/**
 * Filtros específicos para usuarios
 */
export interface UserFilters {
  isActive?: boolean
  dni?: string
}

/**
 * Parámetros completos para consulta de usuarios
 */
export interface UserQueryParams
  extends PaginationParams,
    SortParams<UserSortField>,
    SearchParams,
    UserFilters {}

/**
 * Resultado de consulta paginada de usuarios
 */
export interface PaginatedUserResult {
  users: UserWithProfile[]
  total: number
}
