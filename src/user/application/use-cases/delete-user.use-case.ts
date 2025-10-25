import { Inject, Injectable } from '@nestjs/common'

import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(uuid: string): Promise<void> {
    const user = await this.userRepository.findByUuid(uuid)

    if(!user) {
      throw new UserNotFoundException(uuid)
    }
    await this.userRepository.delete(uuid)
  }
}
