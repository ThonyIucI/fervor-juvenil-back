import { Expose } from 'class-transformer'

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

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial)
  }
}
