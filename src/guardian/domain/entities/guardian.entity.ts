import { uuidv7 } from 'uuidv7'

import { GuardianBadFieldException } from '../exceptions/guardian-bad-field.exception'

export interface GuardianData {
  userUuid: string
  fullName: string
  phone?: string
  email?: string
  contactType?: string
}

export class Guardian {
  private uuid: string
  private userUuid: string
  private fullName: string
  private phone?: string
  private email?: string
  private contactType?: string
  private createdAt: Date
  private updatedAt: Date

  private constructor(
    uuid: string,
    userUuid: string,
    fullName: string,
    phone?: string,
    email?: string,
    contactType?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.uuid = uuid
    this.userUuid = userUuid
    this.fullName = fullName
    this.phone = phone
    this.email = email
    this.contactType = contactType
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  /**
   * Factory method to create a new Guardian
   * Validates all fields before creating the instance
   */
  static make(data: GuardianData): Guardian {
    // Validate userUuid
    if(!data.userUuid || data.userUuid.trim() === '') {
      throw new GuardianBadFieldException('userUuid', 'UUID de usuario es requerido')
    }

    // Validate fullName (required)
    if(!data.fullName || data.fullName.trim() === '') {
      throw new GuardianBadFieldException('fullName', 'Nombre completo es requerido')
    }

    if(data.fullName.length > 120) {
      throw new GuardianBadFieldException('fullName', 'Nombre completo no puede exceder 120 caracteres')
    }

    // Validate phone if provided
    if(data.phone !== undefined && data.phone.length > 50) {
      throw new GuardianBadFieldException('phone', 'Teléfono no puede exceder 50 caracteres')
    }

    // Validate email if provided
    if(data.email !== undefined) {
      if(data.email.length > 120) {
        throw new GuardianBadFieldException('email', 'Email no puede exceder 120 caracteres')
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if(data.email && !emailRegex.test(data.email)) {
        throw new GuardianBadFieldException('email', 'Formato de email inválido')
      }
    }

    // Validate contactType if provided
    if(data.contactType !== undefined && data.contactType.length > 50) {
      throw new GuardianBadFieldException('contactType', 'Tipo de contacto no puede exceder 50 caracteres')
    }

    return new Guardian(
      uuidv7(),
      data.userUuid,
      data.fullName.trim(),
      data.phone?.trim(),
      data.email?.trim().toLowerCase(),
      data.contactType?.trim()
    )
  }

  /**
   * Reconstruct a Guardian from database
   * No validation needed as data comes from trusted source
   */
  static reconstruct(
    uuid: string,
    userUuid: string,
    fullName: string,
    phone: string | undefined,
    email: string | undefined,
    contactType: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ): Guardian {
    return new Guardian(
      uuid,
      userUuid,
      fullName,
      phone,
      email,
      contactType,
      createdAt,
      updatedAt
    )
  }

  /**
   * Update guardian data
   * Validates new data before updating
   */
  update(data: Partial<Omit<GuardianData, 'userUuid'>>): void {
    // Create a temporary guardian to validate new data
    const validated = Guardian.make({
      userUuid   : this.userUuid,
      fullName   : data.fullName ?? this.fullName,
      phone      : data.phone ?? this.phone,
      email      : data.email ?? this.email,
      contactType: data.contactType ?? this.contactType
    })

    // If validation passes, update current instance
    this.fullName = validated.fullName
    this.phone = validated.phone
    this.email = validated.email
    this.contactType = validated.contactType
    this.updatedAt = new Date()
  }

  /**
   * Convert to plain object for persistence
   */
  toPrimitives() {
    return {
      uuid       : this.uuid,
      userUuid   : this.userUuid,
      fullName   : this.fullName,
      phone      : this.phone,
      email      : this.email,
      contactType: this.contactType,
      createdAt  : this.createdAt,
      updatedAt  : this.updatedAt
    }
  }

  // Getters
  getUuid(): string { return this.uuid }
  getUserUuid(): string { return this.userUuid }
  getFullName(): string { return this.fullName }
  getPhone(): string | undefined { return this.phone }
  getEmail(): string | undefined { return this.email }
  getContactType(): string | undefined { return this.contactType }
  getCreatedAt(): Date { return this.createdAt }
  getUpdatedAt(): Date { return this.updatedAt }
}
