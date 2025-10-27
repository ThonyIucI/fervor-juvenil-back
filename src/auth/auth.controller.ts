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
    const result = await this.authService.register(registerDto)

    return { data: result }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto)

    return { data: result }
  }

  // Todo: add getProfile service
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: { user: string }) {
    return req.user
  }
}
