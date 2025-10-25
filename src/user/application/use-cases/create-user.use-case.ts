import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/entities/user.entity'
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email)

    if(existingUser) {
      throw new UserAlreadyExistsException(dto.email)
    }

    const user = await User.create(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password
    )

    return this.userRepository.save(user)
  }
}
