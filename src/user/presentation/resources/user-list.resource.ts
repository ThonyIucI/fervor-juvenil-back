import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { UserProfileListResource } from '../../../user-profile/presentation/resources/user-profile-list.resource'
import { User } from '../../domain/entities/user.entity'

interface UserListResourceData {
  uuid: string
  firstName: string
  lastName: string
  email: string
  slug: string
  dni: string | null
  isGoogleAccount: boolean
  createdAt: Date
  updatedAt: Date
  profile: UserProfile | null
}

/**
 * Resource para usuario en listados
 * Transforma la entidad de usuario a un formato para listados con perfil limitado
 */
export class UserListResource {
  uuid: string
  firstName: string
  lastName: string
  email: string
  slug: string
  dni: string | null
  isGoogleAccount: boolean
  createdAt: Date
  updatedAt: Date
  profile: UserProfileListResource | null

  constructor(data: UserListResourceData) {
    this.uuid = data.uuid
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.slug = data.slug
    this.dni = data.dni
    this.isGoogleAccount = data.isGoogleAccount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.profile = data.profile
      ? UserProfileListResource.fromDomain(data.profile)
      : null
  }

  /**
   * Transforma una entidad de usuario con perfil a resource
   * @param userWithProfile - Objeto con user y profile del dominio
   */
  static fromDomain(userWithProfile: { user: User; profile: UserProfile | null }): UserListResource {
    const { user } = userWithProfile

    return new UserListResource({
      uuid           : user.getUuid(),
      firstName      : user.getFirstName(),
      lastName       : user.getLastName(),
      email          : user.getEmail(),
      slug           : user.getSlug(),
      dni            : user.getDni(),
      isGoogleAccount: user.getIsGoogleAccount(),
      createdAt      : user.getCreatedAt(),
      updatedAt      : user.getUpdatedAt(),
      profile        : userWithProfile.profile
    })
  }

  /**
   * Transforma un array de usuarios con perfil a resources
   */
  static collection(usersWithProfile: Array<{ user: User; profile: UserProfile | null }>): UserListResource[] {
    return usersWithProfile.map((userWithProfile) =>
      UserListResource.fromDomain(userWithProfile)
    )
  }
}
