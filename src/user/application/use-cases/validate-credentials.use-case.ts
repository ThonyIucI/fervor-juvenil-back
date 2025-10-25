import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

@Injectable()
export class ValidateCredentialsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)

    if(!user) {
      throw new InvalidCredentialsException('email')
    }

    const isValid = await user.validatePassword(password)

    if(!isValid) {
      throw new InvalidCredentialsException('password')
    }

    return user
  }
}
