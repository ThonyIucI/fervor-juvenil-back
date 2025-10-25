import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/entities/user.entity'
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'
import { UpdateUserDto } from '../dto/update-user.dto'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(uuid: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findByUuid(uuid)

    if(!user) {
      throw new UserNotFoundException(uuid)
    }

    if(dto.email && dto.email !== user.getEmail()) {
      const existingUser = await this.userRepository.findByEmail(dto.email)

      if(existingUser) {
        throw new UserAlreadyExistsException(dto.email)
      }
      await user.updateEmail(dto.email)
    }

    if(dto.firstName || dto.lastName) {
      await user.updateName(
        dto.firstName || user.getFirstName(),
        dto.lastName || user.getLastName()
      )
    }

    if(dto.password) {
      await user.updatePassword(dto.password)
    }

    return this.userRepository.save(user)
  }
}
