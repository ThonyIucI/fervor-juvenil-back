import { UnauthorizedException } from '@nestjs/common'

type InvalidCredentialField = 'email' | 'password'

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(field?: InvalidCredentialField) {
    const errorMessages: Record<InvalidCredentialField | 'credentials', string> = {
      email      : 'No existe un usuario con ese correo electrónico.',
      password   : 'La contraseña que ingresaste es incorrecta.',
      credentials: 'Las credenciales proporcionadas son inválidas.'
    }

    const fieldKey = field || 'credentials'
    const errors = { [fieldKey]: errorMessages[fieldKey] }

    super({
      statusCode: 401,
      message   : 'Credenciales inválidas',
      errors
    })
  }
}
