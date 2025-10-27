import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { GetUserRolesUseCase } from 'src/role/application/use-cases/get-user-roles.use-case'
import { FindUserByUuidUseCase } from 'src/user/application/use-cases/find-user-by-uuid.use-case'

interface JwtPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly findUserByUuidUseCase: FindUserByUuidUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase
  ) {
    super({
      jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey     : configService.get<string>('JWT_SECRET') ?? ''
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.findUserByUuidUseCase.execute(payload.sub)

    if(!user) return null

    // Load user roles from database
    const roles = await this.getUserRolesUseCase.execute(user.getUuid())

    return {
      sub      : user.getUuid(), // Usar 'sub' para consistencia con JWT payload
      uuid     : user.getUuid(),
      email    : user.getEmail(),
      firstName: user.getFirstName(),
      lastName : user.getLastName(),
      roles // Array de nombres de roles ['admin', 'user', etc]
    }
  }
}
