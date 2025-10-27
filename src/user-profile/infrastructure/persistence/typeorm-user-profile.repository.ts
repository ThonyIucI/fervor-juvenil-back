import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserProfile } from '../../domain/entities/user-profile.entity'
import { IUserProfileRepository } from '../../domain/repositories/user-profile.repository.interface'
import { UserProfileMapper } from '../mappers/user-profile.mapper'

import { UserProfileSchema } from './user-profile.schema'

@Injectable()
export class TypeOrmUserProfileRepository implements IUserProfileRepository {
  constructor(
    @InjectRepository(UserProfileSchema)
    private readonly repository: Repository<UserProfileSchema>
  ) {}

  async save(userProfile: UserProfile): Promise<UserProfile> {
    const schema = UserProfileMapper.toSchema(userProfile)
    const saved = await this.repository.save(schema)

    return UserProfileMapper.toDomain(saved)
  }

  async findByUserUuid(userUuid: string): Promise<UserProfile | null> {
    const schema = await this.repository.findOne({
      where    : { user: { uuid: userUuid } },
      relations: [ 'user' ]
    })

    return schema ? UserProfileMapper.toDomain(schema) : null
  }

  async findByUuid(uuid: string): Promise<UserProfile | null> {
    const schema = await this.repository.findOne({
      where    : { uuid },
      relations: [ 'user' ]
    })

    return schema ? UserProfileMapper.toDomain(schema) : null
  }

  async findAll(): Promise<UserProfile[]> {
    const schemas = await this.repository.find({
      relations: [ 'user' ]
    })

    return schemas.map(UserProfileMapper.toDomain)
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete(uuid)
  }
}
