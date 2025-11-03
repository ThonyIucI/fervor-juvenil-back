import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'

import { PaginationDto } from '../../../common/dto/pagination.dto'

/**
 * Campos permitidos para ordenar usuarios
 */
export enum UserSortField {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  CREATED_AT = 'createdAt',
  IS_ACTIVE = 'isActive',
}

/**
 * DTO para obtener usuarios paginados con filtros
 */
export class GetPaginatedUsersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(UserSortField, {
    message: `El campo de ordenamiento debe ser uno de: ${Object.values(UserSortField).join(', ')}`
  })
    sortBy?: UserSortField = UserSortField.LAST_NAME

  @IsOptional()
  @Type(() => String)
    sortOrder?: 'ASC' | 'DESC' = 'ASC'

  @IsOptional()
    search?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean
}
