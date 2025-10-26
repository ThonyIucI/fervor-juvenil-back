import { CustomError } from '../../../common/exceptions/custom-error'

/**
 * Exception thrown when a Role field validation fails
 */
export class RoleBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de rol inválido: ${field}. ${reason}`, 400)
  }
}
