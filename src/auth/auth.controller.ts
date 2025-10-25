import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'

@Controller({
  path   : 'v1/auth',
  version: '1'
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  // Todo: add getProfile service
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: { user: string }) {
    return req.user
  }
}
