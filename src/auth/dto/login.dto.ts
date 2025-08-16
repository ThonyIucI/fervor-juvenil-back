import {
  IsEmailSpanish,
  isNotEmptySpanish
} from 'src/common/validators/spanish-validators'

export class LoginDto {
  @IsEmailSpanish()
    email: string

  @isNotEmptySpanish('Contraseña')
    password: string
}
