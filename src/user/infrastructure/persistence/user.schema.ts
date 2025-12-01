import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserProfileSchema } from '../../../user-profile/infrastructure/persistence/user-profile.schema'

@Entity({ name: 'users' })
export class UserSchema {
  @PrimaryColumn('uuid')
    uuid: string

  @Column()
    slug: string

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
    email: string

  @Column({ type: 'varchar', length: 255 })
    password: string

  @Column({ type: 'varchar', length: 20, nullable: true })
    dni: string

  @Column({ type: 'boolean', default: true })
    isActive: boolean

  @Column({ default: false })
    isGoogleAccount: boolean

  @OneToOne(() => UserProfileSchema, (profile) => profile.user, { nullable: true })
    profile?: UserProfileSchema

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
