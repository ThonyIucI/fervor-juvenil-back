import { Inject, Injectable } from '@nestjs/common'

import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../../user-profile/domain/repositories/user-profile.repository.interface'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY, UserWithProfile } from '../../domain/repositories/user.repository.interface'
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto'

/**
 * Use case for updating current authenticated user's profile information
 * Handles both user basic data (name, email) and profile data
 */
@Injectable()
export class UpdateCurrentUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  /**
   * Updates user and profile data
   * Creates profile if it doesn't exist
   * @param userUuid - UUID of the authenticated user
   * @param updateDto - Data to update (user fields and/or profile fields)
   * @returns Updated user with profile
   * @throws UserNotFoundException if user does not exist
   */
  async execute(userUuid: string, updateDto: UpdateUserProfileDto): Promise<UserWithProfile> {
    // 1. Verificar que el usuario existe
    const user = await this.userRepository.findByUuid(userUuid)

    if(!user) {
      throw new UserNotFoundException()
    }

    // 2. Actualizar datos básicos del usuario (si vienen en el DTO)
    // Las validaciones se hacen dentro de los métodos de la entidad User
    const { firstName, lastName, email, ...profileData } = updateDto

    if(firstName || lastName) {
      // Obtener datos actuales una sola vez para eficiencia
      const currentUserData = user.toPrimitives()

      await user.updateName(
        firstName || currentUserData.firstName,
        lastName || currentUserData.lastName
      )
    }

    if(email) {
      await user.updateEmail(email)
    }

    // Guardar usuario si hubo cambios
    if(firstName || lastName || email) {
      await this.userRepository.save(user)
    }

    // 3. Buscar o crear perfil
    let profile = await this.userProfileRepository.findByUserUuid(userUuid)

    if(!profile) {
      // Crear nuevo perfil con los datos proporcionados
      // La validación se hace dentro del método make
      profile = UserProfile.make(userUuid, profileData as any)
    } else {
      // Actualizar perfil existente solo con los campos proporcionados
      // La validación se hace dentro del método update
      profile.update(profileData as any)
    }

    // 4. Guardar perfil
    const savedProfile = await this.userProfileRepository.save(profile)

    // 5. Retornar user con profile actualizado
    return {
      user,
      profile: savedProfile
    }
  }
}
