import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'

import { Request, Response } from 'express'

interface ExceptionResponse {
  statusCode: number
  message: string
  errors?: string[] | Record<string, string>
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    if(exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse() as (string | ExceptionResponse)

      let message = ''
      let errors: string[] | Record<string, string> | undefined = undefined

      if(typeof exceptionResponse === 'string') {
        message = exceptionResponse
      }
      else if(typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const { errors: responseErrors, message: responseMessage } = exceptionResponse

        errors = responseErrors
        message = responseMessage
      }

      response.status(status).json({
        statusCode: status,
        path      : request.url,
        message,
        errors
      })

      return
    }

    // Errores no controlados
    console.error(exception)
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path      : request.url,
      message   : 'Error interno del servidor'
    })
  }
}
