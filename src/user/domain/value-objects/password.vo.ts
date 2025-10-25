import * as bcrypt from 'bcrypt'

export class Password {
  private readonly value: string
  private readonly isHashed: boolean

  private constructor(value: string, isHashed: boolean = false) {
    this.value = value
    this.isHashed = isHashed
  }

  static create(plainPassword: string): Password {
    if(!plainPassword || plainPassword.trim().length === 0) {
      throw new Error('La contraseña es requerida')
    }

    if(plainPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    return new Password(plainPassword, false)
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, true)
  }

  async hash(): Promise<Password> {
    if(this.isHashed) {
      return this
    }

    const hashed = await bcrypt.hash(this.value, 10)

    return new Password(hashed, true)
  }

  async compare(plainPassword: string): Promise<boolean> {
    if(!this.isHashed) {
      throw new Error('No se puede comparar una contraseña que no está hasheada')
    }

    return bcrypt.compare(plainPassword, this.value)
  }

  getValue(): string {
    return this.value
  }

  getIsHashed(): boolean {
    return this.isHashed
  }
}
