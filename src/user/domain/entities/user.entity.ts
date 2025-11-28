import { uuidv7 } from 'uuidv7'

import { Email } from '../value-objects/email.vo'
import { Password } from '../value-objects/password.vo'
import { UserName } from '../value-objects/user-name.vo'

export class User {
  private uuid: string
  private name: UserName
  private email: Email
  private password: Password
  private slug: string
  private dni: string | null
  private isGoogleAccount: boolean
  private createdAt: Date
  private updatedAt: Date

  private constructor(
    uuid: string,
    name: UserName,
    email: Email,
    password: Password,
    slug: string,
    dni: string | null = null,
    isGoogleAccount: boolean = false,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.uuid = uuid
    this.name = name
    this.email = email
    this.password = password
    this.slug = slug
    this.dni = dni
    this.isGoogleAccount = isGoogleAccount
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  static async create(
    firstName: string,
    lastName: string,
    email: string,
    plainPassword: string,
    dni: string | null = null,
    isGoogleAccount: boolean = false
  ): Promise<User> {
    const nameVO = UserName.create(firstName, lastName)
    const emailVO = Email.create(email)
    const passwordVO = Password.create(plainPassword)
    const hashedPasswordVO = await passwordVO.hash()

    return new User(
      uuidv7(),
      nameVO,
      emailVO,
      hashedPasswordVO,
      nameVO.getSlug(),
      dni,
      isGoogleAccount
    )
  }

  static reconstruct(
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
    slug: string,
    dni: string | null,
    isGoogleAccount: boolean,
    createdAt: Date,
    updatedAt: Date
  ): User {
    const nameVO = UserName.create(firstName, lastName)
    const emailVO = Email.create(email)
    const passwordVO = Password.fromHash(hashedPassword)

    return new User(
      uuid,
      nameVO,
      emailVO,
      passwordVO,
      slug,
      dni,
      isGoogleAccount,
      createdAt,
      updatedAt
    )
  }

  async updateName(firstName: string, lastName: string): Promise<void> {
    this.name = UserName.create(firstName, lastName)
    this.slug = this.name.getSlug()
    this.updatedAt = new Date()
  }

  async updateEmail(email: string): Promise<void> {
    this.email = Email.create(email)
    this.updatedAt = new Date()
  }

  async updatePassword(plainPassword: string): Promise<void> {
    const passwordVO = Password.create(plainPassword)

    this.password = await passwordVO.hash()
    this.updatedAt = new Date()
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword)
  }

  getUuid(): string {
    return this.uuid
  }

  getFirstName(): string {
    return this.name.getFirstName()
  }

  getLastName(): string {
    return this.name.getLastName()
  }

  getFullName(): string {
    return this.name.getFullName()
  }

  getEmail(): string {
    return this.email.getValue()
  }

  getHashedPassword(): string {
    return this.password.getValue()
  }

  getSlug(): string {
    return this.slug
  }

  getDni(): string | null {
    return this.dni
  }

  getIsGoogleAccount(): boolean {
    return this.isGoogleAccount
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  /**
   * Convert to plain object for persistence
   */
  toPrimitives() {
    return {
      uuid           : this.uuid,
      firstName      : this.name.getFirstName(),
      lastName       : this.name.getLastName(),
      email          : this.email.getValue(),
      hashedPassword : this.password.getValue(),
      slug           : this.slug,
      dni            : this.dni,
      isGoogleAccount: this.isGoogleAccount,
      createdAt      : this.createdAt,
      updatedAt      : this.updatedAt
    }
  }
}
