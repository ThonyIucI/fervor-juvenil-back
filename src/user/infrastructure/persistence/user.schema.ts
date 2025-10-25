import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

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

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
