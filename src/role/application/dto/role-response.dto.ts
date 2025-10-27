import { RoleSchema } from '../../infrastructure/persistence/role.schema'

/**
 * DTO for role response
 * Contains role information without sensitive data
 */
export class RoleResponseDto {
  uuid: string
  name: string
  description: string | null

  /**
   * Creates a RoleResponseDto from RoleSchema
   * @param roleSchema - Role schema from database
   */
  static fromSchema(roleSchema: RoleSchema): RoleResponseDto {
    const dto = new RoleResponseDto()

    dto.uuid = roleSchema.uuid
    dto.name = roleSchema.name
    dto.description = roleSchema.description || null

    return dto
  }
}
