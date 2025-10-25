import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserSchema } from '../../../user/infrastructure/persistence/user.schema'

import { RoleSchema } from './role.schema'

@Entity({ name: 'user_roles' })
export class UserRoleSchema {
  @PrimaryColumn('uuid')
    uuid: string

  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
    user: UserSchema

  @ManyToOne(() => RoleSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_uuid' })
    role: RoleSchema

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
