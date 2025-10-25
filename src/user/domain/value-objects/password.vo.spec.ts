import { Password } from './password.vo'

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const password = Password.create('password123')

      expect(password.getValue()).toBe('password123')
      expect(password.getIsHashed()).toBe(false)
    })

    it('should throw error for empty password', () => {
      expect(() => Password.create('')).toThrow('La contraseña es requerida')
    })

    it('should throw error for whitespace only', () => {
      expect(() => Password.create('   ')).toThrow('La contraseña es requerida')
    })

    it('should throw error for password shorter than 6 characters', () => {
      expect(() => Password.create('12345')).toThrow('La contraseña debe tener al menos 6 caracteres')
    })

    it('should accept password with exactly 6 characters', () => {
      const password = Password.create('123456')

      expect(password.getValue()).toBe('123456')
    })
  })

  describe('fromHash', () => {
    it('should create password from hash', () => {
      const hashedValue = '$2b$10$hashedpassword'
      const password = Password.fromHash(hashedValue)

      expect(password.getValue()).toBe(hashedValue)
      expect(password.getIsHashed()).toBe(true)
    })
  })

  describe('hash', () => {
    it('should hash a plain password', async () => {
      const password = Password.create('password123')
      const hashed = await password.hash()

      expect(hashed.getValue()).not.toBe('password123')
      expect(hashed.getIsHashed()).toBe(true)
      expect(hashed.getValue()).toMatch(/^\$2[aby]\$\d{2}\$/)
    })

    it('should return same instance if already hashed', async () => {
      const hashedValue = '$2b$10$hashedpassword'
      const password = Password.fromHash(hashedValue)
      const result = await password.hash()

      expect(result).toBe(password)
      expect(result.getValue()).toBe(hashedValue)
    })
  })

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = Password.create('password123')
      const hashed = await password.hash()
      const isValid = await hashed.compare('password123')

      expect(isValid).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const password = Password.create('password123')
      const hashed = await password.hash()
      const isValid = await hashed.compare('wrongpassword')

      expect(isValid).toBe(false)
    })

    it('should throw error when comparing with non-hashed password', async () => {
      const password = Password.create('password123')

      await expect(password.compare('anything')).rejects.toThrow(
        'No se puede comparar una contraseña que no está hasheada'
      )
    })
  })
})
