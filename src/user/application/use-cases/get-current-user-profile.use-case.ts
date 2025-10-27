import { Inject, Injectable } from '@nestjs/common'

import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY, UserWithProfile } from '../../domain/repositories/user.repository.interface'

/**
 * Use case for getting current authenticated user's profile information
 * Returns user data along with their profile if it exists
 */
@Injectable()
export class GetCurrentUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Retrieves user and profile data by user UUID
   * @param userUuid - UUID of the authenticated user
   * @returns User with profile data (profile can be null if not yet created)
   * @throws UserNotFoundException if user does not exist
   */
  async execute(userUuid: string): Promise<UserWithProfile> {
    const userWithProfile = await this.userRepository.findByUuidWithProfile(userUuid)

    if(!userWithProfile) {
      throw new UserNotFoundException()
    }

    return userWithProfile
  }
}
