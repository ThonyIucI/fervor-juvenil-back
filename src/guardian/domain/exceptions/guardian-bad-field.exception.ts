import { CustomError } from '../../../common/exceptions/custom-error'

/**
 * Exception thrown when a Guardian field validation fails
 */
export class GuardianBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de apoderado inválido: ${field}. ${reason}`)
  }
}
