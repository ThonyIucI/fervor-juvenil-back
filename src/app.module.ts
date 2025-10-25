import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { join } from 'path'

import { AuthModule } from './auth/auth.module'
import { SeedsModule } from './seeds/seeds.module'
import { HealthController } from './health/health.controller'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal   : true
    }),
    TypeOrmModule.forRootAsync({
      imports   : [ ConfigModule ],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DATABASE_URL')

        // Prioriza DATABASE_URL si está disponible
        if(databaseUrl) {
          return {
            type            : 'postgres',
            url             : databaseUrl,
            entities        : [ join(__dirname, '**', '*.entity.{ts,js}'), join(__dirname, '**', '*.schema.{ts,js}') ],
            migrations      : [ join(__dirname, '..', 'migrations', '*.{ts,js}') ],
            synchronize     : false,
            namingStrategy  : new SnakeNamingStrategy(),
            autoLoadEntities: true,
            ssl             : {
              rejectUnauthorized: false // Necesario para conexiones remotas como Render
            }
          }
        }

        // Usa variables individuales para desarrollo local
        return {
          type            : 'postgres',
          host            : config.get('DB_HOST'),
          port            : config.get('DB_PORT'),
          username        : config.get('DB_USERNAME'),
          password        : config.get('DB_PASSWORD'),
          database        : config.get('DB_NAME'),
          entities        : [ join(__dirname, '**', '*.entity.{ts,js}'), join(__dirname, '**', '*.schema.{ts,js}') ],
          migrations      : [ join(__dirname, '..', 'migrations', '*.{ts,js}') ],
          synchronize     : false,
          namingStrategy  : new SnakeNamingStrategy(),
          autoLoadEntities: true
        }
      },
      inject: [ ConfigService ]
    }),
    AuthModule,
    SeedsModule
  ],
  controllers: [ AppController, HealthController ],
  providers  : [ AppService ]
})
export class AppModule {}
