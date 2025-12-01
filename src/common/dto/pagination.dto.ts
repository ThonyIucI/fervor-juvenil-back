import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

import { SortOrder } from '../types/pagination.types'
import { MinSpanish } from '../validators/spanish-validators'

/**
 * DTO base para parámetros de paginación
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
    page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
    limit?: number = 10
}

/**
 * DTO base para parámetros de búsqueda
 */
export class SearchDto {
  @IsOptional()
  @MinSpanish(1, 'búsqueda')
    search?: string
}

/**
 * DTO base para parámetros de ordenamiento
 * Debe ser extendido por DTOs específicos de módulo
 */
export class SortDto {
  @IsOptional()
  @IsEnum(SortOrder, {
    message: `El orden debe ser ${SortOrder.ASC} o ${SortOrder.DESC}`
  })
    sortOrder?: SortOrder = SortOrder.ASC
}
