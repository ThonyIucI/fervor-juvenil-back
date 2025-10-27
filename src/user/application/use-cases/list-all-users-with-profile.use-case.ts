import { Inject, Injectable } from '@nestjs/common'

import { IUserRepository, USER_REPOSITORY, UserWithProfile } from '../../domain/repositories/user.repository.interface'

/**
 * Use case for listing all users with their profile information
 * This endpoint should only be accessible by admins/superadmins
 */
@Injectable()
export class ListAllUsersWithProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Retrieves all users with their profiles
   * @returns Array of users with their profiles (profile can be null if not created yet)
   */
  async execute(): Promise<UserWithProfile[]> {
    return this.userRepository.findAllWithProfile()
  }
}
