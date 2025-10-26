import { CustomError } from '../../../common/exceptions/custom-error'

/**
 * Exception thrown when a User field validation fails
 */
export class UserBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de usuario inválido: ${field}. ${reason}`)
  }
}
