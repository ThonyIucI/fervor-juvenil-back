import { UserProfile } from '../../domain/entities/user-profile.entity'
import { UserProfileSchema } from '../persistence/user-profile.schema'

export class UserProfileMapper {
  /**
   * Maps domain entity to TypeORM schema
   */
  static toSchema(userProfile: UserProfile): UserProfileSchema {
    const primitives = userProfile.toPrimitives()
    const schema = new UserProfileSchema()

    schema.uuid = primitives.uuid
    schema.user = { uuid: primitives.userUuid } as any
    schema.registrationDate = primitives.registrationDate
    schema.lastNames = primitives.lastNames
    schema.firstNames = primitives.firstNames
    schema.gender = primitives.gender
    schema.age = primitives.age
    schema.birthDate = primitives.birthDate
    schema.status = primitives.status
    schema.alias = primitives.alias
    schema.hasUniform = primitives.hasUniform
    schema.shirtSize = primitives.shirtSize
    schema.pantsSize = primitives.pantsSize
    schema.shoeSize = primitives.shoeSize
    schema.heightMeters = primitives.heightMeters
    schema.weightKg = primitives.weightKg
    schema.healthInsurance = primitives.healthInsurance
    schema.bloodType = primitives.bloodType
    schema.allergies = primitives.allergies
    schema.disabilityOrDisorder = primitives.disabilityOrDisorder
    schema.enrollmentDate = primitives.enrollmentDate
    schema.currentResidence = primitives.currentResidence
    schema.professionalGoal = primitives.professionalGoal
    schema.favoriteHero = primitives.favoriteHero
    schema.createdAt = primitives.createdAt
    schema.updatedAt = primitives.updatedAt

    return schema
  }

  /**
   * Maps TypeORM schema to domain entity
   */
  static toDomain(schema: UserProfileSchema): UserProfile {
    return UserProfile.reconstruct(
      schema.uuid,
      schema.user?.uuid,
      {
        registrationDate    : schema.registrationDate,
        lastNames           : schema.lastNames,
        firstNames          : schema.firstNames,
        gender              : schema.gender,
        age                 : schema.age,
        birthDate           : schema.birthDate,
        status              : schema.status,
        alias               : schema.alias,
        hasUniform          : schema.hasUniform,
        shirtSize           : schema.shirtSize,
        pantsSize           : schema.pantsSize,
        shoeSize            : schema.shoeSize,
        heightMeters        : schema.heightMeters,
        weightKg            : schema.weightKg,
        healthInsurance     : schema.healthInsurance,
        bloodType           : schema.bloodType,
        allergies           : schema.allergies,
        disabilityOrDisorder: schema.disabilityOrDisorder,
        enrollmentDate      : schema.enrollmentDate,
        currentResidence    : schema.currentResidence,
        professionalGoal    : schema.professionalGoal,
        favoriteHero        : schema.favoriteHero
      },
      schema.createdAt,
      schema.updatedAt
    )
  }
}
