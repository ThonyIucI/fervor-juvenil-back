/**
 * Tipos estándar para paginación reutilizables en toda la aplicación
 */

/**
 * Orden de clasificación para campos
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Parámetros de paginación base
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Parámetros de ordenamiento
 */
export interface SortParams<T = string> {
  sortBy?: T
  sortOrder?: SortOrder
}

/**
 * Parámetros de búsqueda
 */
export interface SearchParams {
  search?: string
}

/**
 * Parámetros completos de consulta paginada
 */
export interface PaginatedQueryParams<T = string>
  extends PaginationParams,
    SortParams<T>,
    SearchParams {}

/**
 * Metadata de paginación
 */
export interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Respuesta paginada estándar
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Utilidad para calcular metadata de paginación
 */
export class PaginationMetaCalculator {
  static calculate(
    totalItems: number,
    page: number,
    limit: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit)

    return {
      currentPage    : page,
      itemsPerPage   : limit,
      totalItems,
      totalPages,
      hasNextPage    : page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}
