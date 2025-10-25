import { Email } from './email.vo'

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('test@example.com')

      expect(email.getValue()).toBe('test@example.com')
    })

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM')

      expect(email.getValue()).toBe('test@example.com')
    })

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ')

      expect(email.getValue()).toBe('test@example.com')
    })

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow('El email es requerido')
    })

    it('should throw error for whitespace only', () => {
      expect(() => Email.create('   ')).toThrow('El email es requerido')
    })

    it('should throw error for invalid format - missing @', () => {
      expect(() => Email.create('invalid.email.com')).toThrow('El formato del email no es válido')
    })

    it('should throw error for invalid format - missing domain', () => {
      expect(() => Email.create('test@')).toThrow('El formato del email no es válido')
    })

    it('should throw error for invalid format - missing TLD', () => {
      expect(() => Email.create('test@domain')).toThrow('El formato del email no es válido')
    })
  })

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com')
      const email2 = Email.create('TEST@EXAMPLE.COM')

      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com')
      const email2 = Email.create('test2@example.com')

      expect(email1.equals(email2)).toBe(false)
    })
  })
})
