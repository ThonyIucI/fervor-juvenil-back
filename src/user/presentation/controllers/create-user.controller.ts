import { Body, Controller, Post } from '@nestjs/common'

import { CreateUserDto } from '../../application/dto/create-user.dto'
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case'
import { UserResponseDto } from '../dto/user-response.dto'

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto)

    return UserResponseDto.fromDomain(user)
  }
}
