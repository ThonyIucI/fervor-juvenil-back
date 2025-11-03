import {
  PaginationParams,
  SearchParams,
  SortParams
} from '../../../common/types/pagination.types'

/**
 * Campos por los que se puede ordenar usuarios
 */
export type UserSortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'createdAt'
  | 'isActive'

/**
 * Filtros específicos para usuarios
 */
export interface UserFilters {
  isActive?: boolean
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
  users: any[] // Será UserWithProfile[] en producción
  total: number
}
