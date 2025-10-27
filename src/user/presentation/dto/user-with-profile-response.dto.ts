import { Exclude, Expose, Type } from 'class-transformer'

import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { User } from '../../domain/entities/user.entity'

@Exclude()
export class UserProfileResponseDto {
  @Expose()
    uuid: string

  @Expose()
    gender?: string

  @Expose()
    age?: number

  @Expose()
    birthDate?: Date

  @Expose()
    status?: string

  @Expose()
    alias?: string

  @Expose()
    hasUniform?: boolean

  @Expose()
    shirtSize?: string | null

  @Expose()
    pantsSize?: string | null

  @Expose()
    shoeSize?: string | null

  @Expose()
    heightMeters?: number | null

  @Expose()
    weightKg?: number | null

  @Expose()
    healthInsurance?: string

  @Expose()
    bloodType?: string

  @Expose()
    allergies?: string | null

  @Expose()
    disabilityOrDisorder?: string | null

  @Expose()
    enrollmentDate?: Date

  @Expose()
    currentResidence?: string

  @Expose()
    professionalGoal?: string

  @Expose()
    favoriteHero?: string

  @Expose()
    firstNames?: string

  @Expose()
    lastNames?: string

  @Expose()
    registrationDate?: Date

  static fromDomain(profile: UserProfile): UserProfileResponseDto {
    const primitives = profile.toPrimitives()
    const dto = new UserProfileResponseDto()

    dto.uuid = primitives.uuid
    dto.gender = primitives.gender
    dto.age = primitives.age
    dto.birthDate = primitives.birthDate
    dto.status = primitives.status
    dto.alias = primitives.alias
    dto.hasUniform = primitives.hasUniform
    dto.shirtSize = primitives.shirtSize
    dto.pantsSize = primitives.pantsSize
    dto.shoeSize = primitives.shoeSize
    dto.heightMeters = primitives.heightMeters
    dto.weightKg = primitives.weightKg
    dto.healthInsurance = primitives.healthInsurance
    dto.bloodType = primitives.bloodType
    dto.allergies = primitives.allergies
    dto.disabilityOrDisorder = primitives.disabilityOrDisorder
    dto.enrollmentDate = primitives.enrollmentDate
    dto.currentResidence = primitives.currentResidence
    dto.professionalGoal = primitives.professionalGoal
    dto.favoriteHero = primitives.favoriteHero
    dto.firstNames = primitives.firstNames
    dto.lastNames = primitives.lastNames
    dto.registrationDate = primitives.registrationDate

    return dto
  }
}

@Exclude()
export class UserWithProfileResponseDto {
  @Expose()
    uuid: string

  @Expose()
    firstName: string

  @Expose()
    lastName: string

  @Expose()
    email: string

  @Expose()
    slug: string

  @Expose()
    isGoogleAccount: boolean

  @Expose()
    createdAt: Date

  @Expose()
    updatedAt: Date

  @Expose()
  @Type(() => UserProfileResponseDto)
    profile: UserProfileResponseDto | null

  static fromDomain(data: { user: User; profile: UserProfile | null }): UserWithProfileResponseDto {
    const userPrimitives = data.user.toPrimitives()
    const dto = new UserWithProfileResponseDto()

    dto.uuid = userPrimitives.uuid
    dto.firstName = userPrimitives.firstName
    dto.lastName = userPrimitives.lastName
    dto.email = userPrimitives.email
    dto.slug = userPrimitives.slug
    dto.isGoogleAccount = userPrimitives.isGoogleAccount
    dto.createdAt = userPrimitives.createdAt
    dto.updatedAt = userPrimitives.updatedAt
    dto.profile = data.profile ? UserProfileResponseDto.fromDomain(data.profile) : null

    return dto
  }
}
