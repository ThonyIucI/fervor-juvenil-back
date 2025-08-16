import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } })
    if(!user) return null
    const isMatch = await bcrypt.compare(password, user.encryptedPassword)
    if(!isMatch)
      throw new UnauthorizedException({
        errors: { password: 'La contraseña que ingresaste es incorrecta.' }
      })

    // todo: chequear emailConfirmed si lo requieres
    return user
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password)
    if(!user)
      throw new NotFoundException({
        errors: {
          email: 'No existe un usuario con ese correo electrónico.'
        }
      })

    const payload = { sub: user.uuid, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        uuid     : user.uuid,
        email    : user.email,
        firstName: user.firstName,
        lastName : user.lastName
      }
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email }
    })
    if(existing)
      throw new ConflictException('El correo ya está registrado')

    const user = await User.make({
      email    : dto.email,
      password : dto.password,
      firstName: dto.firstName,
      lastName : dto.lastName
    })

    return await this.usersRepo.save(user)
  }
}
