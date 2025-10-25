import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/entities/user.entity'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
