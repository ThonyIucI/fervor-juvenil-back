import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/entities/user.entity'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)

    if(!user) {
      throw new UserNotFoundException(email)
    }

    return user
  }
}
