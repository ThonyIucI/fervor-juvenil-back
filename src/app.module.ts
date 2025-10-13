import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { join } from 'path'

import { AuthModule } from './auth/auth.module'
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
      useFactory: (config: ConfigService) => ({
        type            : 'postgres',
        host            : config.get('DB_HOST'),
        port            : config.get('DB_PORT'),
        username        : config.get('DB_USERNAME'),
        password        : config.get('DB_PASSWORD'),
        database        : config.get('DB_NAME'),
        entities        : [ join(__dirname, '**', '*.entity.{ts,js}') ],
        migrations      : [ join(__dirname, '..', 'migrations', '*.{ts,js}') ],
        synchronize     : false,
        namingStrategy  : new SnakeNamingStrategy(),
        autoLoadEntities: true
      }),
      inject: [ ConfigService ]
    }),
    AuthModule
  ],
  controllers: [ AppController, HealthController ],
  providers  : [ AppService ]
})
export class AppModule {}
