export class UserName {
  private readonly firstName: string
  private readonly lastName: string

  private constructor(firstName: string, lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
  }

  static create(firstName: string, lastName: string): UserName {
    if(!firstName || firstName.trim().length === 0) {
      throw new Error('El nombre es requerido')
    }

    if(!lastName || lastName.trim().length === 0) {
      throw new Error('El apellido es requerido')
    }

    return new UserName(firstName.trim(), lastName.trim())
  }

  getFirstName(): string {
    return this.firstName
  }

  getLastName(): string {
    return this.lastName
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  getSlug(): string {
    const fullName = `${this.firstName} ${this.lastName}`

    return fullName.toLowerCase().replace(/\s+/g, '-')
  }
}
