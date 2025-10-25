import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.use-case'
import { ValidateCredentialsUseCase } from 'src/user/application/use-cases/validate-credentials.use-case'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly validateCredentialsUseCase: ValidateCredentialsUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateCredentialsUseCase.execute(
      dto.email,
      dto.password
    )

    const payload = { sub: user.getUuid(), email: user.getEmail() }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        uuid     : user.getUuid(),
        email    : user.getEmail(),
        firstName: user.getFirstName(),
        lastName : user.getLastName()
      }
    }
  }

  async register(dto: RegisterDto) {
    const user = await this.createUserUseCase.execute({
      email    : dto.email,
      password : dto.password,
      firstName: dto.firstName,
      lastName : dto.lastName
    })

    return {
      uuid     : user.getUuid(),
      email    : user.getEmail(),
      firstName: user.getFirstName(),
      lastName : user.getLastName(),
      slug     : user.getSlug()
    }
  }
}
