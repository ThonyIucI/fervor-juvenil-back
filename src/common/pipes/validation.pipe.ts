import { BadRequestException, ValidationPipe } from '@nestjs/common'

import { ValidationError } from 'class-validator'

import { translateValidationErrors } from '../utils/translate-constraints'

export class SpanishValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist           : true,
      forbidNonWhitelisted: true,
      transform           : true,
      transformOptions    : { enableImplicitConversion: true },
      exceptionFactory    : (errors: ValidationError[]) => {
        const messages = translateValidationErrors(errors)

        return new BadRequestException({
          statusCode: 400,
          message   : 'Los datos ingresados no son válidos',
          errors    : messages
        })
      }
    })
  }
}
