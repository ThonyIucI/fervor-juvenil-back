import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepo: Repository<User>
  ) {
    super({
      jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey     : configService.get<string>('JWT_SECRET') ?? ''
    })
  }

  async validate(payload: any) {
    const user = await this.usersRepo.findOne({ where: { uuid: payload.sub } })
    if(!user) return null

    return {
      uuid     : user.uuid,
      email    : user.email,
      firstName: user.firstName,
      lastName : user.lastName
    }
  }
}
