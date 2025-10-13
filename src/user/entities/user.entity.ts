import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Exclude, plainToInstance } from 'class-transformer'
import slugify from 'slugify'
import { uuidv7 } from 'uuidv7'

import { UserResponseDto } from '../dto/user-response.dto'

import { UserBadFieldException } from './exceptions/user-bad-field.exception'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
    uuid: string

  @Column()
    slug: string

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Column({ unique: true, nullable: true })
    email: string

  @Column()
  @Exclude()
  private password: string

  @Column({ 'default': false })
    isGoogleAccount: boolean

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  /* ===== Métodos de creación/edición ===== */

  public static async make(fields: {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
  }): Promise<User> {
    this.ensureFirstNameIsValid(fields.firstName)
    this.ensureLastNameIsValid(fields.lastName)
    this.ensureEmailIsValid(fields.email)

    const user = new User()
    user.uuid = uuidv7()
    user.firstName = fields.firstName.trim()
    user.lastName = fields.lastName.trim()
    user.slug = this.buildSlug(fields.firstName, fields.lastName)
    user.email = fields.email.toLowerCase()
    await user.changePassword(fields.password)
    user.createdAt = new Date()
    user.updatedAt = new Date()

    return user
  }

  public async set(fields: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }): Promise<void> {
    if(fields.firstName) {
      User.ensureFirstNameIsValid(fields.firstName)
      this.firstName = fields.firstName.trim()
    }
    if(fields.lastName) {
      User.ensureLastNameIsValid(fields.lastName)
      this.lastName = fields.lastName.trim()
    }
    if(fields.firstName || fields.lastName)
      this.slug = User.buildSlug(this.firstName, this.lastName)

    if(fields.email) {
      User.ensureEmailIsValid(fields.email)
      this.email = fields.email.toLowerCase()
    }
    if(fields.password)
      this.changePassword(fields.password)

    this.updatedAt = new Date()
  }

  /* ===== Lógica de negocio ===== */

  public async changePassword(newPassword: string): Promise<void> {
    this.password = await this.hashPassword(newPassword)
  }

  public toResponse(): UserResponseDto {
    return plainToInstance(UserResponseDto, this, {
      excludeExtraneousValues: true
    })
  }
  // TODO: uncomment when use confirmAccount
  // public confirmAccount(): void {
  //   this.hasConfirmedAccount = true;
  // }

  // public changeImageUrl(imageUrl: string | null): void {
  //   this.imageUrl = imageUrl;
  // }

  // public deleteImageUrl(): void {
  //   this.imageUrl = null;
  // }

  /* ===== Métodos internos ===== */

  private static ensureFirstNameIsValid(firstName?: string): void {
    if(!firstName || firstName.trim() === '')
      throw new UserBadFieldException('El nombre es requerido')
  }

  private static ensureLastNameIsValid(lastName?: string): void {
    if(!lastName || lastName.trim() === '')
      throw new UserBadFieldException('El apellido es requerido')
  }

  private static ensureEmailIsValid(email?: string): void {
    if(!email || email.trim() === '')
      throw new UserBadFieldException('El email es requerido')
  }

  private static buildSlug(firstName: string, lastName: string): string {
    return slugify(`${firstName} ${lastName}`, {
      lower : true,
      strict: true
    })
  }

  private hashPassword(password: string): Promise<string> {
    if(!password || password.trim() === '')
      throw new UserBadFieldException('La contraseña es requerida')

    const saltRounds = 10

    return bcrypt.hash(password, saltRounds)
  }

  get encryptedPassword(): string {
    return this.password
  }
}
