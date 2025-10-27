import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GetUserRolesUseCase } from 'src/role/application/use-cases/get-user-roles.use-case'
import { GetUserRolesWithDetailsUseCase } from 'src/role/application/use-cases/get-user-roles-with-details.use-case'
import { UserRoleSchema } from 'src/role/infrastructure/persistence/user-role.schema'
import { UserModule } from 'src/user/user.module'

import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([ UserRoleSchema ]),
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
  providers  : [
    AuthService,
    JwtStrategy,
    GetUserRolesUseCase,
    GetUserRolesWithDetailsUseCase
  ]
})
export class AuthModule {}
