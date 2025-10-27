import { RoleResponseDto } from 'src/role/application/dto/role-response.dto'
import { User } from 'src/user/domain/entities/user.entity'

/**
 * DTO for login response
 * Contains access token, user basic info, and user roles
 */
export class LoginResponseDto {
  accessToken: string
  user: {
    uuid: string
    email: string
    firstName: string
    lastName: string
    slug: string
  }
  roles: RoleResponseDto[]

  /**
   * Creates a LoginResponseDto from domain User entity and roles
   * @param user - User domain entity
   * @param roles - Array of role DTOs
   * @param accessToken - JWT access token
   */
  static create(user: User, roles: RoleResponseDto[], accessToken: string): LoginResponseDto {
    const dto = new LoginResponseDto()

    dto.accessToken = accessToken
    dto.user = {
      uuid     : user.getUuid(),
      email    : user.getEmail(),
      firstName: user.getFirstName(),
      lastName : user.getLastName(),
      slug     : user.getSlug()
    }
    dto.roles = roles

    return dto
  }
}
