import { RoleBadFieldException } from '../exceptions/role-bad-field.exception'

/**
 * Enum for allowed role names
 * Single source of truth for role values across the application
 */
export enum RoleName {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user'
}

/**
 * Value Object for Role Name
 * Ensures role name is always valid
 */
export class RoleNameVO {
  private constructor(private readonly value: RoleName) {}

  static create(name: string): RoleNameVO {
    // Validate name (required)
    if(!name || name.trim() === '') {
      throw new RoleBadFieldException('name', 'Nombre de rol es requerido')
    }

    // Normalize to lowercase
    const normalizedName = name.trim().toLowerCase()

    // Validate against enum values
    if(!Object.values(RoleName).includes(normalizedName as RoleName)) {
      const allowedRoles = Object.values(RoleName).join(', ')

      throw new RoleBadFieldException('name', `Rol inválido. Valores permitidos: ${allowedRoles}`)
    }

    return new RoleNameVO(normalizedName as RoleName)
  }

  getValue(): string {
    return this.value
  }

  isSuperadmin(): boolean {
    return this.value === RoleName.SUPERADMIN
  }

  isAdmin(): boolean {
    return this.value === RoleName.ADMIN
  }

  isUser(): boolean {
    return this.value === RoleName.USER
  }

  equals(other: RoleNameVO): boolean {
    return this.value === other.value
  }
}
