import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { join } from 'path'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      imports   : [ ConfigModule ],
      useFactory: (config: ConfigService) => ({
        type          : 'mysql',
        host          : config.get('DB_HOST'),
        port          : config.get('DB_PORT'),
        username      : config.get('DB_USERNAME'),
        password      : config.get('DB_PASSWORD'),
        database      : config.get('DB_NAME'),
        entities      : [ join(__dirname, '**', '*.entity.{ts,js}') ],
        migrations    : [ join(__dirname, '..', 'migrations', '*.{ts,js}') ],
        synchronize   : false,
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ ConfigService ]
    }),
    UserModule,
    AuthModule
  ],
  controllers: [ AppController ],
  providers  : [ AppService ]
})
export class AppModule {}
