import { InvalidCredentialsException } from './invalid-credentials.exception'

describe('InvalidCredentialsException', () => {
  describe('cuando el email no existe', () => {
    it('debería lanzar una excepción con el error en el campo email', () => {
      const exception = new InvalidCredentialsException('email')

      expect(exception.getStatus()).toBe(401)
      expect(exception.getResponse()).toEqual({
        statusCode: 401,
        message   : 'Credenciales inválidas',
        errors    : {
          email: 'No existe un usuario con ese correo electrónico.'
        }
      })
    })
  })

  describe('cuando la contraseña es incorrecta', () => {
    it('debería lanzar una excepción con el error en el campo password', () => {
      const exception = new InvalidCredentialsException('password')

      expect(exception.getStatus()).toBe(401)
      expect(exception.getResponse()).toEqual({
        statusCode: 401,
        message   : 'Credenciales inválidas',
        errors    : {
          password: 'La contraseña que ingresaste es incorrecta.'
        }
      })
    })
  })

  describe('cuando no se especifica el campo', () => {
    it('debería lanzar una excepción genérica', () => {
      const exception = new InvalidCredentialsException()

      expect(exception.getStatus()).toBe(401)
      expect(exception.getResponse()).toEqual({
        statusCode: 401,
        message   : 'Credenciales inválidas',
        errors    : {
          credentials: 'Las credenciales proporcionadas son inválidas.'
        }
      })
    })
  })
})
