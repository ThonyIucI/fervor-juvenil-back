import { Test, TestingModule } from '@nestjs/testing'

import { User } from '../../domain/entities/user.entity'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

import { FindUserByUuidUseCase } from './find-user-by-uuid.use-case'

describe('FindUserByUuidUseCase', () => {
  let useCase: FindUserByUuidUseCase
  let mockRepository: jest.Mocked<IUserRepository>

  beforeEach(async () => {
    mockRepository = {
      save       : jest.fn(),
      findByUuid : jest.fn(),
      findByEmail: jest.fn(),
      findAll    : jest.fn(),
      delete     : jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByUuidUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockRepository
        }
      ]
    }).compile()

    useCase = module.get<FindUserByUuidUseCase>(FindUserByUuidUseCase)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should find and return user by uuid', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')

      mockRepository.findByUuid.mockResolvedValue(user)

      const result = await useCase.execute(user.getUuid())

      expect(mockRepository.findByUuid).toHaveBeenCalledWith(user.getUuid())
      expect(result).toBe(user)
      expect(result.getEmail()).toBe('john@example.com')
    })

    it('should throw UserNotFoundException when user not found', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'

      mockRepository.findByUuid.mockResolvedValue(null)

      await expect(useCase.execute(uuid)).rejects.toThrow(UserNotFoundException)
      await expect(useCase.execute(uuid)).rejects.toThrow(`Usuario con identificador "${uuid}" no fue encontrado`)
    })
  })
})
