import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common'

import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case'

@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('uuid') uuid: string): Promise<void> {
    await this.deleteUserUseCase.execute(uuid)
  }
}
