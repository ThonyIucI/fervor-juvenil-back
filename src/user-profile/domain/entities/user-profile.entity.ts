import { uuidv7 } from 'uuidv7'

import { UserProfileBadFieldException } from '../exceptions/user-profile-bad-field.exception'

export interface UserProfileData {
  userUuid: string
  lastNames?: string
  firstNames?: string
  gender?: string
  age?: number
  birthDate?: Date
  status?: string
  alias?: string
  hasUniform?: boolean
  shirtSize?: string
  pantsSize?: string
  shoeSize?: string
  heightMeters?: number
  weightKg?: number
  healthInsurance?: string
  bloodType?: string
  allergies?: string
  disabilityOrDisorder?: string
  enrollmentDate?: Date
  currentResidence?: string
  professionalGoal?: string
  favoriteHero?: string
  registrationDate?: Date
}

export class UserProfile {
  private uuid: string
  private userUuid: string
  private lastNames?: string
  private firstNames?: string
  private gender?: string
  private age?: number
  private birthDate?: Date
  private status?: string
  private alias?: string
  private hasUniform?: boolean
  private shirtSize?: string
  private pantsSize?: string
  private shoeSize?: string
  private heightMeters?: number
  private weightKg?: number
  private healthInsurance?: string
  private bloodType?: string
  private allergies?: string
  private disabilityOrDisorder?: string
  private enrollmentDate?: Date
  private currentResidence?: string
  private professionalGoal?: string
  private favoriteHero?: string
  private registrationDate?: Date
  private createdAt: Date
  private updatedAt: Date

  private constructor(
    uuid: string,
    userUuid: string,
    data: Partial<UserProfileData>,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.uuid = uuid
    this.userUuid = userUuid
    this.lastNames = data.lastNames
    this.firstNames = data.firstNames
    this.gender = data.gender
    this.age = data.age
    this.birthDate = data.birthDate
    this.status = data.status
    this.alias = data.alias
    this.hasUniform = data.hasUniform
    this.shirtSize = data.shirtSize
    this.pantsSize = data.pantsSize
    this.shoeSize = data.shoeSize
    this.heightMeters = data.heightMeters
    this.weightKg = data.weightKg
    this.healthInsurance = data.healthInsurance
    this.bloodType = data.bloodType
    this.allergies = data.allergies
    this.disabilityOrDisorder = data.disabilityOrDisorder
    this.enrollmentDate = data.enrollmentDate
    this.currentResidence = data.currentResidence
    this.professionalGoal = data.professionalGoal
    this.favoriteHero = data.favoriteHero
    this.registrationDate = data.registrationDate
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  /**
   * Factory method to create a new UserProfile
   * Validates all fields before creating the instance
   */
  static make(userUuid: string, data: UserProfileData): UserProfile {
    // Validate userUuid
    if(!userUuid || userUuid.trim() === '') {
      throw new UserProfileBadFieldException('userUuid', 'UUID de usuario es requerido')
    }

    // Validate names if provided
    if(data.lastNames !== undefined && data.lastNames.length > 120) {
      throw new UserProfileBadFieldException('lastNames', 'Apellidos no pueden exceder 120 caracteres')
    }

    if(data.firstNames !== undefined && data.firstNames.length > 120) {
      throw new UserProfileBadFieldException('firstNames', 'Nombres no pueden exceder 120 caracteres')
    }

    // Validate gender
    if(data.gender !== undefined && ![ 'M', 'F' ].includes(data.gender.toUpperCase())) {
      throw new UserProfileBadFieldException('gender', 'Género debe ser M o F')
    }

    // Validate age
    if(data.age !== undefined && (data.age < 0 || data.age > 150)) {
      throw new UserProfileBadFieldException('age', 'Edad debe estar entre 0 y 150')
    }

    // Validate status
    if(data.status !== undefined && ![ 'A', 'I' ].includes(data.status.toUpperCase())) {
      throw new UserProfileBadFieldException('status', 'Estado debe ser A (Activo) o I (Inactivo)')
    }

    // Validate alias
    if(data.alias !== undefined && data.alias.length > 80) {
      throw new UserProfileBadFieldException('alias', 'Alias no puede exceder 80 caracteres')
    }

    // Validate sizes
    if(data.shirtSize !== undefined && data.shirtSize.length > 5) {
      throw new UserProfileBadFieldException('shirtSize', 'Talla de polo no puede exceder 5 caracteres')
    }

    if(data.pantsSize !== undefined && data.pantsSize.length > 5) {
      throw new UserProfileBadFieldException('pantsSize', 'Talla de pantalón no puede exceder 5 caracteres')
    }

    if(data.shoeSize !== undefined && data.shoeSize.length > 5) {
      throw new UserProfileBadFieldException('shoeSize', 'Talla de zapato no puede exceder 5 caracteres')
    }

    // Validate height
    if(data.heightMeters !== undefined && (data.heightMeters < 0 || data.heightMeters > 3)) {
      throw new UserProfileBadFieldException('heightMeters', 'Altura debe estar entre 0 y 3 metros')
    }

    // Validate weight
    if(data.weightKg !== undefined && (data.weightKg < 0 || data.weightKg > 500)) {
      throw new UserProfileBadFieldException('weightKg', 'Peso debe estar entre 0 y 500 kg')
    }

    // Validate health insurance
    if(data.healthInsurance !== undefined && data.healthInsurance.length > 50) {
      throw new UserProfileBadFieldException('healthInsurance', 'Seguro de salud no puede exceder 50 caracteres')
    }

    // Validate blood type
    if(data.bloodType !== undefined) {
      const validBloodTypes = [ 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' ]

      if(!validBloodTypes.includes(data.bloodType.toUpperCase())) {
        throw new UserProfileBadFieldException('bloodType', `Tipo de sangre inválido. Valores permitidos: ${validBloodTypes.join(', ')}`)
      }
    }

    // Validate residence
    if(data.currentResidence !== undefined && data.currentResidence.length > 120) {
      throw new UserProfileBadFieldException('currentResidence', 'Residencia actual no puede exceder 120 caracteres')
    }

    // Validate professional goal
    if(data.professionalGoal !== undefined && data.professionalGoal.length > 120) {
      throw new UserProfileBadFieldException('professionalGoal', 'Meta profesional no puede exceder 120 caracteres')
    }

    // Validate favorite hero
    if(data.favoriteHero !== undefined && data.favoriteHero.length > 120) {
      throw new UserProfileBadFieldException('favoriteHero', 'Superhéroe favorito no puede exceder 120 caracteres')
    }

    return new UserProfile(
      uuidv7(),
      userUuid,
      {
        ...data,
        gender   : data.gender?.toUpperCase(),
        status   : data.status?.toUpperCase(),
        bloodType: data.bloodType?.toUpperCase()
      }
    )
  }

  /**
   * Reconstruct a UserProfile from database
   * No validation needed as data comes from trusted source
   */
  static reconstruct(
    uuid: string,
    userUuid: string,
    data: Partial<UserProfileData>,
    createdAt: Date,
    updatedAt: Date
  ): UserProfile {
    return new UserProfile(uuid, userUuid, data, createdAt, updatedAt)
  }

  /**
   * Update profile data
   * Validates new data before updating
   */
  update(data: Partial<UserProfileData>): void {
    // Create a temporary profile to validate new data
    const validated = UserProfile.make(this.userUuid, {
      ...this.toPrimitives(),
      ...data
    } as UserProfileData)

    // If validation passes, update current instance
    Object.assign(this, {
      ...validated.toPrimitives(),
      uuid     : this.uuid, // Preserve original UUID
      createdAt: this.createdAt, // Preserve creation date
      updatedAt: new Date() // Update modification date
    })
  }

  /**
   * Convert to plain object for persistence
   */
  toPrimitives() {
    return {
      uuid                : this.uuid,
      userUuid            : this.userUuid,
      lastNames           : this.lastNames,
      firstNames          : this.firstNames,
      gender              : this.gender,
      age                 : this.age,
      birthDate           : this.birthDate,
      status              : this.status,
      alias               : this.alias,
      hasUniform          : this.hasUniform,
      shirtSize           : this.shirtSize,
      pantsSize           : this.pantsSize,
      shoeSize            : this.shoeSize,
      heightMeters        : this.heightMeters,
      weightKg            : this.weightKg,
      healthInsurance     : this.healthInsurance,
      bloodType           : this.bloodType,
      allergies           : this.allergies,
      disabilityOrDisorder: this.disabilityOrDisorder,
      enrollmentDate      : this.enrollmentDate,
      currentResidence    : this.currentResidence,
      professionalGoal    : this.professionalGoal,
      favoriteHero        : this.favoriteHero,
      registrationDate    : this.registrationDate,
      createdAt           : this.createdAt,
      updatedAt           : this.updatedAt
    }
  }

  // Getters
  getUuid(): string { return this.uuid }
  getUserUuid(): string { return this.userUuid }
  getLastNames(): string | undefined { return this.lastNames }
  getFirstNames(): string | undefined { return this.firstNames }
  getFullName(): string | undefined {
    if(!this.firstNames && !this.lastNames) return undefined

    return `${this.firstNames || ''} ${this.lastNames || ''}`.trim()
  }
  getGender(): string | undefined { return this.gender }
  getAge(): number | undefined { return this.age }
  getBirthDate(): Date | undefined { return this.birthDate }
  getStatus(): string | undefined { return this.status }
  getAlias(): string | undefined { return this.alias }
  getHasUniform(): boolean | undefined { return this.hasUniform }
  getShirtSize(): string | undefined { return this.shirtSize }
  getPantsSize(): string | undefined { return this.pantsSize }
  getShoeSize(): string | undefined { return this.shoeSize }
  getHeightMeters(): number | undefined { return this.heightMeters }
  getWeightKg(): number | undefined { return this.weightKg }
  getHealthInsurance(): string | undefined { return this.healthInsurance }
  getBloodType(): string | undefined { return this.bloodType }
  getAllergies(): string | undefined { return this.allergies }
  getDisabilityOrDisorder(): string | undefined { return this.disabilityOrDisorder }
  getEnrollmentDate(): Date | undefined { return this.enrollmentDate }
  getCurrentResidence(): string | undefined { return this.currentResidence }
  getProfessionalGoal(): string | undefined { return this.professionalGoal }
  getFavoriteHero(): string | undefined { return this.favoriteHero }
  getRegistrationDate(): Date | undefined { return this.registrationDate }
  getCreatedAt(): Date { return this.createdAt }
  getUpdatedAt(): Date { return this.updatedAt }
}
