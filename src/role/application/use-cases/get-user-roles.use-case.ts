import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleSchema } from '../../infrastructure/persistence/user-role.schema'

/**
 * Use case for getting user roles from database
 * Returns array of role names for a given user UUID
 */
@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @InjectRepository(UserRoleSchema)
    private readonly userRoleRepository: Repository<UserRoleSchema>
  ) {}

  /**
   * Gets all role names for a user
   * @param userUuid - UUID of the user
   * @returns Array of role names (e.g., ['admin', 'user'])
   */
  async execute(userUuid: string): Promise<string[]> {
    const userRoles = await this.userRoleRepository.find({
      where: {
        user: { uuid: userUuid }
      },
      relations: [ 'role' ]
    })

    return userRoles.map((userRole) => userRole.role.name)
  }
}
