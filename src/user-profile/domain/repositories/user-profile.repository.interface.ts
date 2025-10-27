import { UserProfile } from '../entities/user-profile.entity'

export interface IUserProfileRepository {
  save(userProfile: UserProfile): Promise<UserProfile>
  findByUserUuid(userUuid: string): Promise<UserProfile | null>
  findByUuid(uuid: string): Promise<UserProfile | null>
  findAll(): Promise<UserProfile[]>
  delete(uuid: string): Promise<void>
}

export const USER_PROFILE_REPOSITORY = Symbol('IUserProfileRepository')
