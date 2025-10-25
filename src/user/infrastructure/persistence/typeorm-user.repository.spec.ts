import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'

import { User } from '../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

import { TypeOrmUserRepository } from './typeorm-user.repository'
import { UserSchema } from './user.schema'

describe('TypeOrmUserRepository', () => {
  let repository: TypeOrmUserRepository
  let mockTypeOrmRepository: jest.Mocked<Repository<UserSchema>>

  beforeEach(async () => {
    mockTypeOrmRepository = {
      save   : jest.fn(),
      findOne: jest.fn(),
      find   : jest.fn(),
      delete : jest.fn()
    } as unknown as jest.Mocked<Repository<UserSchema>>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmUserRepository,
        {
          provide : getRepositoryToken(UserSchema),
          useValue: mockTypeOrmRepository
        }
      ]
    }).compile()

    repository = module.get<TypeOrmUserRepository>(TypeOrmUserRepository)
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  describe('save', () => {
    it('should save and return domain entity', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const schema = UserMapper.toPersistence(user)

      mockTypeOrmRepository.save.mockResolvedValue(schema)

      const result = await repository.save(user)

      expect(mockTypeOrmRepository.save).toHaveBeenCalled()
      expect(result).toBeInstanceOf(User)
      expect(result.getEmail()).toBe('john@example.com')
    })
  })

  describe('findByUuid', () => {
    it('should find user by uuid and return domain entity', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const schema = UserMapper.toPersistence(user)

      mockTypeOrmRepository.findOne.mockResolvedValue(schema)

      const result = await repository.findByUuid(user.getUuid())

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: user.getUuid() }
      })
      expect(result).toBeInstanceOf(User)
      expect(result?.getUuid()).toBe(user.getUuid())
    })

    it('should return null when user not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null)

      const result = await repository.findByUuid('non-existent-uuid')

      expect(result).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email and return domain entity', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const schema = UserMapper.toPersistence(user)

      mockTypeOrmRepository.findOne.mockResolvedValue(schema)

      const result = await repository.findByEmail('john@example.com')

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' }
      })
      expect(result).toBeInstanceOf(User)
      expect(result?.getEmail()).toBe('john@example.com')
    })

    it('should return null when user not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null)

      const result = await repository.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return array of domain entities', async () => {
      const user1 = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const user2 = await User.create('Jane', 'Smith', 'jane@example.com', 'password123')
      const schema1 = UserMapper.toPersistence(user1)
      const schema2 = UserMapper.toPersistence(user2)

      mockTypeOrmRepository.find.mockResolvedValue([ schema1, schema2 ])

      const result = await repository.findAll()

      expect(mockTypeOrmRepository.find).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(User)
      expect(result[1]).toBeInstanceOf(User)
    })

    it('should return empty array when no users exist', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([])

      const result = await repository.findAll()

      expect(result).toEqual([])
    })
  })

  describe('delete', () => {
    it('should delete user by uuid', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'

      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult)

      await repository.delete(uuid)

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith({ uuid })
    })
  })
})
