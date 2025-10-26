import { CustomError } from '../../../common/exceptions/custom-error'

/**
 * Exception thrown when a UserProfile field validation fails
 */
export class UserProfileBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de perfil inválido: ${field}. ${reason}`)
  }
}
