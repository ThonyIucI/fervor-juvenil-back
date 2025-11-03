import { UserProfileListResource } from '../../../user-profile/presentation/resources/user-profile-list.resource'

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
  isGoogleAccount: boolean
  createdAt: Date
  updatedAt: Date
  profile: UserProfileListResource | null

  constructor(data: any) {
    this.uuid = data.uuid
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.slug = data.slug
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
  static fromDomain(userWithProfile: { user: any; profile: any }): UserListResource {
    const { user } = userWithProfile

    return new UserListResource({
      uuid           : user.getUuid(),
      firstName      : user.getFirstName(),
      lastName       : user.getLastName(),
      email          : user.getEmail(),
      slug           : user.getSlug(),
      isGoogleAccount: user.getIsGoogleAccount(),
      createdAt      : user.getCreatedAt(),
      updatedAt      : user.getUpdatedAt(),
      profile        : userWithProfile.profile
    })
  }

  /**
   * Transforma un array de usuarios con perfil a resources
   */
  static collection(usersWithProfile: Array<{ user: any; profile: any }>): UserListResource[] {
    return usersWithProfile.map((userWithProfile) =>
      UserListResource.fromDomain(userWithProfile)
    )
  }
}
