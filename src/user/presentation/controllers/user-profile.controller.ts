import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common'

import { Request } from 'express'

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'
import { UpdateUserProfileDto } from '../../application/dto/update-user-profile.dto'
import { GetCurrentUserProfileUseCase } from '../../application/use-cases/get-current-user-profile.use-case'
import { UpdateCurrentUserProfileUseCase } from '../../application/use-cases/update-current-user-profile.use-case'
import { UserWithProfileResponseDto } from '../dto/user-with-profile-response.dto'

/**
 * Controller for managing current authenticated user's profile
 * All endpoints require JWT authentication
 */
@Controller({
  path   : 'v1/users',
  version: '1'
})
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(
    private readonly getCurrentUserProfileUseCase: GetCurrentUserProfileUseCase,
    private readonly updateCurrentUserProfileUseCase: UpdateCurrentUserProfileUseCase
  ) {}

  /**
   * GET /api/users/me
   * Returns the current authenticated user's profile information
   */
  @Get('me')
  async getCurrentProfile(@Req() req: Request): Promise<{ data: UserWithProfileResponseDto }> {
    const userUuid = req.user['sub'] // JWT payload contains user UUID as 'sub'

    const userWithProfile = await this.getCurrentUserProfileUseCase.execute(userUuid)

    return {
      data: UserWithProfileResponseDto.fromDomain(userWithProfile)
    }
  }

  /**
   * PUT /api/users/me
   * Updates the current authenticated user's profile information
   */
  @Put('me')
  async updateCurrentProfile(
    @Req() req: Request,
    @Body() updateDto: UpdateUserProfileDto
  ): Promise<{ message: string; data: UserWithProfileResponseDto }> {
    const userUuid = req.user['sub']
    const userWithProfile = await this.updateCurrentUserProfileUseCase.execute(
      userUuid,
      updateDto
    )

    return {
      message: 'Perfil actualizado exitosamente',
      data   : UserWithProfileResponseDto.fromDomain(userWithProfile)
    }
  }
}
