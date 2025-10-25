import { Controller, Get, Param } from '@nestjs/common'

import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case'
import { FindUserByUuidUseCase } from '../../application/use-cases/find-user-by-uuid.use-case'
import { UserResponseDto } from '../dto/user-response.dto'

@Controller('users')
export class FindUserController {
  constructor(
    private readonly findUserByUuidUseCase: FindUserByUuidUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.findAllUsersUseCase.execute()

    return users.map(UserResponseDto.fromDomain)
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string): Promise<UserResponseDto> {
    const user = await this.findUserByUuidUseCase.execute(uuid)

    return UserResponseDto.fromDomain(user)
  }
}
