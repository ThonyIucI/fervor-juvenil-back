import { Body, Controller, Param, Patch } from '@nestjs/common'

import { UpdateUserDto } from '../../application/dto/update-user.dto'
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case'
import { UserResponseDto } from '../dto/user-response.dto'

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute(uuid, dto)

    return UserResponseDto.fromDomain(user)
  }
}
