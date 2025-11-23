import { UserProfile } from '../../domain/entities/user-profile.entity'

/**
 * Resource para perfil de usuario en listados
 * Transforma la entidad de perfil a un formato limitado para listados
 *
 * Campos incluidos:
 * - uuid, gender, age, birthDate, status
 * - shirtSize, pantsSize, shoeSize
 */
export class UserProfileListResource {
  uuid: string
  gender: string | null
  age: number | null
  birthDate: Date | null
  status: string | null
  shirtSize: string | null
  pantsSize: string | null
  shoeSize: string | null

  constructor(profile: UserProfile) {
    this.uuid = profile.getUuid()
    this.gender = profile.getGender() || null
    this.age = profile.getAge() || null
    this.birthDate = profile.getBirthDate() || null
    this.status = profile.getStatus() || null
    this.shirtSize = profile.getShirtSize() || null
    this.pantsSize = profile.getPantsSize() || null
    this.shoeSize = profile.getShoeSize() || null
  }

  /**
   * Transforma una entidad de perfil a resource
   */
  static fromDomain(profile: UserProfile): UserProfileListResource {
    return new UserProfileListResource(profile)
  }

  /**
   * Transforma un array de perfiles a resources
   */
  static collection(profiles: UserProfile[]): UserProfileListResource[] {
    return profiles.map((profile) => UserProfileListResource.fromDomain(profile))
  }
}
