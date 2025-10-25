import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserSchema } from '../../../user/infrastructure/persistence/user.schema'

@Entity({ name: 'guardians' })
export class GuardianSchema {
  @PrimaryColumn('uuid')
    uuid: string

  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
    user: UserSchema

  @Column({ type: 'varchar', length: 120 })
    fullName: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string

  @Column({ type: 'varchar', length: 120, nullable: true })
    email: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    contactType: string

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
