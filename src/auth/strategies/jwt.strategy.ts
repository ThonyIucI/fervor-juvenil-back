import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

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
    private readonly findUserByUuidUseCase: FindUserByUuidUseCase
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

    return {
      uuid     : user.getUuid(),
      email    : user.getEmail(),
      firstName: user.getFirstName(),
      lastName : user.getLastName()
    }
  }
}
