import { UserName } from './user-name.vo'

describe('UserName Value Object', () => {
  describe('create', () => {
    it('should create a valid user name', () => {
      const userName = UserName.create('John', 'Doe')

      expect(userName.getFirstName()).toBe('John')
      expect(userName.getLastName()).toBe('Doe')
    })

    it('should trim whitespace from names', () => {
      const userName = UserName.create('  John  ', '  Doe  ')

      expect(userName.getFirstName()).toBe('John')
      expect(userName.getLastName()).toBe('Doe')
    })

    it('should throw error for empty first name', () => {
      expect(() => UserName.create('', 'Doe')).toThrow('El nombre es requerido')
    })

    it('should throw error for whitespace-only first name', () => {
      expect(() => UserName.create('   ', 'Doe')).toThrow('El nombre es requerido')
    })

    it('should throw error for empty last name', () => {
      expect(() => UserName.create('John', '')).toThrow('El apellido es requerido')
    })

    it('should throw error for whitespace-only last name', () => {
      expect(() => UserName.create('John', '   ')).toThrow('El apellido es requerido')
    })
  })

  describe('getFullName', () => {
    it('should return full name', () => {
      const userName = UserName.create('John', 'Doe')

      expect(userName.getFullName()).toBe('John Doe')
    })

    it('should handle names with spaces', () => {
      const userName = UserName.create('Mary Jane', 'Smith Watson')

      expect(userName.getFullName()).toBe('Mary Jane Smith Watson')
    })
  })

  describe('getSlug', () => {
    it('should generate slug from names', () => {
      const userName = UserName.create('John', 'Doe')

      expect(userName.getSlug()).toBe('john-doe')
    })

    it('should handle uppercase names', () => {
      const userName = UserName.create('JOHN', 'DOE')

      expect(userName.getSlug()).toBe('john-doe')
    })

    it('should handle names with spaces', () => {
      const userName = UserName.create('Mary Jane', 'Smith Watson')

      expect(userName.getSlug()).toBe('mary-jane-smith-watson')
    })
  })
})
