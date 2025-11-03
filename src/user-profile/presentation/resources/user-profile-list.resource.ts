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

  constructor(profile: any) {
    this.uuid = profile.uuid
    this.gender = profile.gender || null
    this.age = profile.age || null
    this.birthDate = profile.birthDate || null
    this.status = profile.status || null
    this.shirtSize = profile.shirtSize || null
    this.pantsSize = profile.pantsSize || null
    this.shoeSize = profile.shoeSize || null
  }

  /**
   * Transforma una entidad de perfil a resource
   */
  static fromDomain(profile: any): UserProfileListResource {
    return new UserProfileListResource(profile)
  }

  /**
   * Transforma un array de perfiles a resources
   */
  static collection(profiles: any[]): UserProfileListResource[] {
    return profiles.map((profile) => UserProfileListResource.fromDomain(profile))
  }
}
