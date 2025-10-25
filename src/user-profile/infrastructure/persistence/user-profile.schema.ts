import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserSchema } from '../../../user/infrastructure/persistence/user.schema'

@Entity({ name: 'user_profiles' })
export class UserProfileSchema {
  @PrimaryColumn('uuid')
    uuid: string

  @OneToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
    user: UserSchema

  @Column({ type: 'timestamp', nullable: true })
    registrationDate: Date

  @Column({ type: 'varchar', length: 120, nullable: true })
    lastNames: string

  @Column({ type: 'varchar', length: 120, nullable: true })
    firstNames: string

  @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string

  @Column({ type: 'smallint', nullable: true })
    age: number

  @Column({ type: 'date', nullable: true })
    birthDate: Date

  @Column({ type: 'varchar', length: 10, nullable: true })
    status: string

  @Column({ type: 'varchar', length: 80, nullable: true })
    alias: string

  @Column({ type: 'boolean', nullable: true })
    hasUniform: boolean

  @Column({ type: 'varchar', length: 5, nullable: true })
    shirtSize: string

  @Column({ type: 'varchar', length: 5, nullable: true })
    pantsSize: string

  @Column({ type: 'varchar', length: 5, nullable: true })
    shoeSize: string

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
    heightMeters: number

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    weightKg: number

  @Column({ type: 'varchar', length: 50, nullable: true })
    healthInsurance: string

  @Column({ type: 'varchar', length: 5, nullable: true })
    bloodType: string

  @Column({ type: 'text', nullable: true })
    allergies: string

  @Column({ type: 'text', nullable: true })
    disabilityOrDisorder: string

  @Column({ type: 'date', nullable: true })
    enrollmentDate: Date

  @Column({ type: 'varchar', length: 120, nullable: true })
    currentResidence: string

  @Column({ type: 'varchar', length: 120, nullable: true })
    professionalGoal: string

  @Column({ type: 'varchar', length: 120, nullable: true })
    favoriteHero: string

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
