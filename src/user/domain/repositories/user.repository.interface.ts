import { User } from '../entities/user.entity'
import {
  PaginatedUserResult,
  UserQueryParams
} from '../types/user-query.types'

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
  findPaginated(params: UserQueryParams): Promise<PaginatedUserResult>
  delete(uuid: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
