import { CustomError } from 'src/common/utils/exceptions/custom-error.exception'

export class UserBadFieldException extends CustomError {
  constructor(message: string) {
    super(message)
  }
}
