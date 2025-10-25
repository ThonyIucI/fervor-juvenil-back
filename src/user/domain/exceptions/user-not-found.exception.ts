import { NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string) {
    super(`Usuario con identificador "${identifier}" no fue encontrado`)
  }
}
