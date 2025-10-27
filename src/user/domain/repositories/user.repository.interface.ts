import { User } from '../entities/user.entity'

export interface UserWithProfile {
  user: User
  profile: any | null // We'll use any for now since it's from another module
}

export interface IUserRepository {
  save(user: User): Promise<User>
  findByUuid(uuid: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findByUuidWithProfile(uuid: string): Promise<UserWithProfile | null>
  findAllWithProfile(): Promise<UserWithProfile[]>
  delete(uuid: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
