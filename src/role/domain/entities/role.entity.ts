import { uuidv7 } from 'uuidv7'

import { RoleBadFieldException } from '../exceptions/role-bad-field.exception'
import { RoleNameVO } from '../value-objects/role-name.vo'

export interface RoleData {
  name: string
  description?: string
}

export class Role {
  private uuid: string
  private name: RoleNameVO
  private description?: string
  private createdAt: Date
  private updatedAt: Date

  private constructor(
    uuid: string,
    name: RoleNameVO,
    description?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.uuid = uuid
    this.name = name
    this.description = description
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  /**
   * Factory method to create a new Role
   * Validates all fields before creating the instance
   */
  static make(data: RoleData): Role {
    // Validate and create name VO
    const nameVO = RoleNameVO.create(data.name)

    // Validate description if provided
    if(data.description !== undefined && data.description.length > 255) {
      throw new RoleBadFieldException('description', 'Descripción no puede exceder 255 caracteres')
    }

    return new Role(
      uuidv7(),
      nameVO,
      data.description?.trim()
    )
  }

  /**
   * Reconstruct a Role from database
   * No validation needed as data comes from trusted source
   */
  static reconstruct(
    uuid: string,
    name: string,
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ): Role {
    const nameVO = RoleNameVO.create(name)

    return new Role(uuid, nameVO, description, createdAt, updatedAt)
  }

  /**
   * Update role description
   * Name cannot be changed for consistency
   */
  updateDescription(description: string): void {
    if(description.length > 255) {
      throw new RoleBadFieldException('description', 'Descripción no puede exceder 255 caracteres')
    }

    this.description = description.trim()
    this.updatedAt = new Date()
  }

  /**
   * Convert to plain object for persistence
   */
  toPrimitives() {
    return {
      uuid       : this.uuid,
      name       : this.name.getValue(),
      description: this.description,
      createdAt  : this.createdAt,
      updatedAt  : this.updatedAt
    }
  }

  // Getters
  getUuid(): string { return this.uuid }
  getName(): string { return this.name.getValue() }
  getNameVO(): RoleNameVO { return this.name }
  getDescription(): string | undefined { return this.description }
  getCreatedAt(): Date { return this.createdAt }
  getUpdatedAt(): Date { return this.updatedAt }

  // Check role type (delegated to VO)
  isSuperadmin(): boolean { return this.name.isSuperadmin() }
  isAdmin(): boolean { return this.name.isAdmin() }
  isUser(): boolean { return this.name.isUser() }
}
