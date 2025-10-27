import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserProfileMapper } from '../../../user-profile/infrastructure/mappers/user-profile.mapper'
import { User } from '../../domain/entities/user.entity'
import { IUserRepository, UserWithProfile } from '../../domain/repositories/user.repository.interface'
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

  async findAllWithProfile(): Promise<UserWithProfile[]> {
    const schemas = await this.repository.find({
      relations: [ 'profile' ],
      select   : {
        uuid           : true,
        firstName      : true,
        lastName       : true,
        email          : true,
        slug           : true,
        isGoogleAccount: true,
        isActive       : true,
        createdAt      : true,
        updatedAt      : true,
        profile        : {
          uuid     : true,
          gender   : true,
          age      : true,
          status   : true,
          birthDate: true
        }
      }
    })

    return schemas.map((schema) => ({
      user   : UserMapper.toDomain(schema),
      profile: schema.profile ? UserProfileMapper.toDomain(schema.profile) : null
    }))
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete({ uuid })
  }
}
