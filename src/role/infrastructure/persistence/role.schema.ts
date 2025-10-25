import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'roles' })
export class RoleSchema {
  @PrimaryColumn('uuid')
    uuid: string

  @Column({ type: 'varchar', length: 50, unique: true })
    name: string

  @Column({ type: 'varchar', length: 255, nullable: true })
    description: string

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
