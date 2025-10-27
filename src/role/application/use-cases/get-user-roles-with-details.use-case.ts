import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleSchema } from '../../infrastructure/persistence/user-role.schema'
import { RoleResponseDto } from '../dto/role-response.dto'

/**
 * Use case for getting user roles with complete details from database
 * Returns array of role objects (uuid, name, description) for a given user UUID
 */
@Injectable()
export class GetUserRolesWithDetailsUseCase {
  constructor(
    @InjectRepository(UserRoleSchema)
    private readonly userRoleRepository: Repository<UserRoleSchema>
  ) {}

  /**
   * Gets all roles with details for a user
   * @param userUuid - UUID of the user
   * @returns Array of role DTOs with uuid, name, and description
   */
  async execute(userUuid: string): Promise<RoleResponseDto[]> {
    const userRoles = await this.userRoleRepository.find({
      where: {
        user: { uuid: userUuid }
      },
      relations: [ 'role' ]
    })

    return userRoles.map((userRole) => RoleResponseDto.fromSchema(userRole.role))
  }
}
