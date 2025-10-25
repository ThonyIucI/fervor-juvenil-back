import {
  isEmail as isEmailFn,
  registerDecorator,
  ValidationOptions
} from 'class-validator'

function defaultMessage(field: string, suffix = 'es requerido') {
  const lower = field.charAt(0).toLowerCase() + field.slice(1)

  return `El campo ${lower} ${suffix}`.replace('El email', 'El correo')
}

/** Decorador para campos requeridos (IsNotEmpty) */
export function isNotEmptySpanish(
  fieldName?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    const name = fieldName || propertyName

    registerDecorator({
      name   : 'isRequired',
      target : object.constructor,
      propertyName,
      options: {
        message: defaultMessage(name, 'es requerido'),
        ...validationOptions
      },
      validator: {
        validate(value: unknown) {
          return (
            value !== null &&
            value !== undefined &&
            !(typeof value === 'string' && value.trim() === '')
          )
        }
      }
    })
  }
}

/** Decorador para email con mensaje en español */
export function IsEmailSpanish(
  fieldName?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name   : 'isEmailSpanish',
      target : object.constructor,
      propertyName,
      options: {
        message: 'El correo electrónico no es válido',
        ...validationOptions
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isEmailFn(value)
        }
      }
    })
  }
}

/** Decorador para (MinLength) que genera mensaje español */
export function MinLengthSpanish(
  min: number,
  fieldName?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name   : 'minLengthSpanish',
      target : object.constructor,
      propertyName,
      options: {
        message: `${fieldName || propertyName} debe tener al menos ${min} caracteres`,
        ...validationOptions
      },
      validator: {
        validate(value: unknown) {
          if(typeof value !== 'string') return false

          return value.length >= min
        }
      }
    })
  }
}
