import {
  IsEmailSpanish,
  isNotEmptySpanish
} from 'src/common/validators/spanish-validators'

export class RegisterDto {
  @IsEmailSpanish()
    email: string

  @isNotEmptySpanish('Contraseña')
    password: string

  @isNotEmptySpanish('Nombres')
    firstName: string

  @isNotEmptySpanish('Apellidos')
    lastName: string
}
