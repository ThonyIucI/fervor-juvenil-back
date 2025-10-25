import {
  IsEmailSpanish,
  isNotEmptySpanish,
  MinLengthSpanish
} from 'src/common/validators/spanish-validators'

export class CreateUserDto {
  @isNotEmptySpanish()
    firstName: string

  @isNotEmptySpanish()
    lastName: string

  @IsEmailSpanish()
    email: string

  @MinLengthSpanish(6)
    password: string
}
