import { NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor(identifier?: string) {
    // Solo mostramos identificadores que el usuario entienda (email, teléfono, etc.)

    if(!identifier) {
      super('Usuario no encontrado')
    } else {
      super(`Usuario con ${identifier} no fue encontrado`)
    }
  }
}
