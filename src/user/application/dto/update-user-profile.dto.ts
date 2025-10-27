import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'

import { IsEmailSpanish } from '../../../common/validators/spanish-validators'

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString({ message: 'Nombres debe ser un texto' })
  @MaxLength(50, { message: 'Nombres no puede exceder 50 caracteres' })
    firstName?: string

  @IsOptional()
  @IsString({ message: 'Apellidos debe ser un texto' })
  @MaxLength(50, { message: 'Apellidos no puede exceder 50 caracteres' })
    lastName?: string

  @IsOptional()
  @IsEmailSpanish()
    email?: string

  @IsOptional()
  @IsString({ message: 'Género debe ser un texto' })
    gender?: string

  @IsOptional()
  @IsNumber({}, { message: 'Edad debe ser un número' })
  @Min(0, { message: 'Edad debe ser mayor o igual a 0' })
  @Max(150, { message: 'Edad debe ser menor o igual a 150' })
    age?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Fecha de nacimiento debe ser una fecha válida' })
    birthDate?: Date

  @IsOptional()
  @IsString({ message: 'Estado debe ser un texto' })
    status?: string

  @IsOptional()
  @IsString({ message: 'Alias debe ser un texto' })
  @MaxLength(80, { message: 'Alias no puede exceder 80 caracteres' })
    alias?: string

  @IsOptional()
  @IsBoolean({ message: 'Has Uniform debe ser verdadero o falso' })
    hasUniform?: boolean

  @IsOptional()
  @IsString({ message: 'Talla de camisa debe ser un texto' })
  @MaxLength(5, { message: 'Talla de camisa no puede exceder 5 caracteres' })
    shirtSize?: string

  @IsOptional()
  @IsString({ message: 'Talla de pantalón debe ser un texto' })
  @MaxLength(5, { message: 'Talla de pantalón no puede exceder 5 caracteres' })
    pantsSize?: string

  @IsOptional()
  @IsString({ message: 'Talla de zapato debe ser un texto' })
  @MaxLength(5, { message: 'Talla de zapato no puede exceder 5 caracteres' })
    shoeSize?: string

  @IsOptional()
  @IsNumber({}, { message: 'Altura debe ser un número' })
  @Min(0, { message: 'Altura debe ser mayor o igual a 0' })
  @Max(3, { message: 'Altura debe ser menor o igual a 3 metros' })
    heightMeters?: number

  @IsOptional()
  @IsNumber({}, { message: 'Peso debe ser un número' })
  @Min(0, { message: 'Peso debe ser mayor o igual a 0' })
  @Max(500, { message: 'Peso debe ser menor o igual a 500 kg' })
    weightKg?: number

  @IsOptional()
  @IsString({ message: 'Seguro de salud debe ser un texto' })
  @MaxLength(50, { message: 'Seguro de salud no puede exceder 50 caracteres' })
    healthInsurance?: string

  @IsOptional()
  @IsString({ message: 'Tipo de sangre debe ser un texto' })
    bloodType?: string

  @IsOptional()
  @IsString({ message: 'Alergias debe ser un texto' })
    allergies?: string

  @IsOptional()
  @IsString({ message: 'Discapacidad o trastorno debe ser un texto' })
    disabilityOrDisorder?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Fecha de inscripción debe ser una fecha válida' })
    enrollmentDate?: Date

  @IsOptional()
  @IsString({ message: 'Residencia actual debe ser un texto' })
  @MaxLength(120, { message: 'Residencia actual no puede exceder 120 caracteres' })
    currentResidence?: string

  @IsOptional()
  @IsString({ message: 'Meta profesional debe ser un texto' })
  @MaxLength(120, { message: 'Meta profesional no puede exceder 120 caracteres' })
    professionalGoal?: string

  @IsOptional()
  @IsString({ message: 'Superhéroe favorito debe ser un texto' })
  @MaxLength(120, { message: 'Superhéroe favorito no puede exceder 120 caracteres' })
    favoriteHero?: string

  @IsOptional()
  @IsString({ message: 'Nombres en perfil debe ser un texto' })
  @MaxLength(120, { message: 'Nombres en perfil no puede exceder 120 caracteres' })
    firstNames?: string

  @IsOptional()
  @IsString({ message: 'Apellidos en perfil debe ser un texto' })
  @MaxLength(120, { message: 'Apellidos en perfil no puede exceder 120 caracteres' })
    lastNames?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Fecha de registro debe ser una fecha válida' })
    registrationDate?: Date
}
