import { User } from '../entities/user.entity'

export interface IUserRepository {
  save(user: User): Promise<User>
  findByUuid(uuid: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  delete(uuid: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
