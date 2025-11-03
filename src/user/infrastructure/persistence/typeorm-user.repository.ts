import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SortOrder } from '../../../common/types/pagination.types'
import { UserProfileMapper } from '../../../user-profile/infrastructure/mappers/user-profile.mapper'
import { User } from '../../domain/entities/user.entity'
import {
  IUserRepository,
  UserWithProfile
} from '../../domain/repositories/user.repository.interface'
import {
  PaginatedUserResult,
  UserQueryParams
} from '../../domain/types/user-query.types'
import { UserMapper } from '../mappers/user.mapper'

import { UserSchema } from './user.schema'

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>
  ) {}

  async save(user: User): Promise<User> {
    const schema = UserMapper.toPersistence(user)
    const saved = await this.repository.save(schema)

    return UserMapper.toDomain(saved)
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { uuid } })

    return schema ? UserMapper.toDomain(schema) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } })

    return schema ? UserMapper.toDomain(schema) : null
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.repository.find()

    return schemas.map(UserMapper.toDomain)
  }

  async findByUuidWithProfile(uuid: string): Promise<UserWithProfile | null> {
    const schema = await this.repository.findOne({
      where    : { uuid },
      relations: [ 'profile' ]
    })

    if(!schema) return null

    return {
      user   : UserMapper.toDomain(schema),
      profile: schema.profile ? UserProfileMapper.toDomain(schema.profile) : null
    }
  }

  async findPaginated(params: UserQueryParams): Promise<PaginatedUserResult> {
    // Create query builder
    const qb = this.repository.createQueryBuilder('user')

    // Join with profile (left join to include users without profile)
    qb.leftJoinAndSelect('user.profile', 'profile')

    // Apply filters
    if(params.isActive !== undefined) {
      qb.andWhere('user.isActive = :isActive', { isActive: params.isActive })
    }

    // Search by name or email
    if(params.search) {
      qb.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${params.search}%` }
      )
    }

    // Apply sorting - default: active users first, then by lastName
    if(params.isActive === undefined) {
      qb.addOrderBy('user.isActive', 'DESC')
    }

    // Then apply user's requested sorting
    const sortField = params.sortBy || 'lastName'
    const sortOrder = params.sortOrder || SortOrder.ASC

    qb.addOrderBy(`user.${sortField}`, sortOrder)

    // Apply pagination
    const skip = (params.page - 1) * params.limit

    qb.skip(skip).take(params.limit)

    // Execute query
    const [ schemas, total ] = await qb.getManyAndCount()

    // Map to domain
    const users: UserWithProfile[] = schemas.map((schema) => ({
      user   : UserMapper.toDomain(schema),
      profile: schema.profile
        ? UserProfileMapper.toDomain(schema.profile)
        : null
    }))

    return { users, total }
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete({ uuid })
  }
}
