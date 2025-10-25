import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from 'src/user/user.module'

import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports   : [ ConfigModule ],
      inject    : [ ConfigService ],
      useFactory: async (config: ConfigService) => ({
        secret     : config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      })
    })
  ],
  controllers: [ AuthController ],
  providers  : [ AuthService, JwtStrategy ]
})
export class AuthModule {}
