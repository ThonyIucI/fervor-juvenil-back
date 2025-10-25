export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(email: string): Email {
    const trimmed = email?.trim() || ''

    if(!trimmed || trimmed.length === 0) {
      throw new Error('El email es requerido')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(trimmed)) {
      throw new Error('El formato del email no es válido')
    }

    return new Email(trimmed.toLowerCase())
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
