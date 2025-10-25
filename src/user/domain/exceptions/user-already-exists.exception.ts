import { ConflictException } from '@nestjs/common'

export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Ya existe un usuario con el email "${email}"`)
  }
}
