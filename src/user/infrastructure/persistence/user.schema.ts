import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'users' })
export class UserSchema {
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
    password: string

  @Column({ default: false })
    isGoogleAccount: boolean

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
