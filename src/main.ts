import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { SpanishValidationPipe } from './common/pipes/validation.pipe'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    exposedHeaders: [ 'X-File-Name', 'Content-Disposition' ]
  })

  app.setGlobalPrefix('api')

  // Filtro global para excepciones HTTP
  app.useGlobalFilters(new HttpExceptionFilter())

  // Pipe de validación global personalizado (mensajes en español)
  app.useGlobalPipes(new SpanishValidationPipe())

  await app.listen(process.env.PORT ?? 3005)
}
bootstrap()
