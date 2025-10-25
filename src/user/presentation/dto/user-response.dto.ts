import { Expose } from 'class-transformer'

import { User } from '../../domain/entities/user.entity'

export class UserResponseDto {
  @Expose()
    uuid: string

  @Expose()
    slug: string

  @Expose()
    firstName: string

  @Expose()
    lastName: string

  @Expose()
    email: string

  @Expose()
    isGoogleAccount: boolean

  @Expose()
    createdAt: Date

  @Expose()
    updatedAt: Date

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto()

    dto.uuid = user.getUuid()
    dto.slug = user.getSlug()
    dto.firstName = user.getFirstName()
    dto.lastName = user.getLastName()
    dto.email = user.getEmail()
    dto.isGoogleAccount = user.getIsGoogleAccount()
    dto.createdAt = user.getCreatedAt()
    dto.updatedAt = user.getUpdatedAt()

    return dto
  }
}
