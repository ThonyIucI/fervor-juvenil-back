import { Test, TestingModule } from '@nestjs/testing'

import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case'
import { FindUserByUuidUseCase } from '../../application/use-cases/find-user-by-uuid.use-case'
import { User } from '../../domain/entities/user.entity'

import { FindUserController } from './find-user.controller'

describe('FindUserController', () => {
  let controller: FindUserController
  let findUserByUuidUseCase: jest.Mocked<FindUserByUuidUseCase>
  let findAllUsersUseCase: jest.Mocked<FindAllUsersUseCase>

  beforeEach(async () => {
    const mockFindUserByUuidUseCase = {
      execute: jest.fn()
    }

    const mockFindAllUsersUseCase = {
      execute: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ FindUserController ],
      providers  : [
        {
          provide : FindUserByUuidUseCase,
          useValue: mockFindUserByUuidUseCase
        },
        {
          provide : FindAllUsersUseCase,
          useValue: mockFindAllUsersUseCase
        }
      ]
    }).compile()

    controller = module.get<FindUserController>(FindUserController)
    findUserByUuidUseCase = module.get(FindUserByUuidUseCase)
    findAllUsersUseCase = module.get(FindAllUsersUseCase)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of user response DTOs', async () => {
      const user1 = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const user2 = await User.create('Jane', 'Smith', 'jane@example.com', 'password123')

      findAllUsersUseCase.execute.mockResolvedValue([ user1, user2 ])

      const result = await controller.findAll()

      expect(findAllUsersUseCase.execute).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0].email).toBe('john@example.com')
      expect(result[1].email).toBe('jane@example.com')
      expect(result[0]).not.toHaveProperty('password')
    })

    it('should return empty array when no users exist', async () => {
      findAllUsersUseCase.execute.mockResolvedValue([])

      const result = await controller.findAll()

      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return user response DTO for valid uuid', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')
      const uuid = user.getUuid()

      findUserByUuidUseCase.execute.mockResolvedValue(user)

      const result = await controller.findOne(uuid)

      expect(findUserByUuidUseCase.execute).toHaveBeenCalledWith(uuid)
      expect(result.email).toBe('john@example.com')
      expect(result.firstName).toBe('John')
      expect(result).not.toHaveProperty('password')
    })

    it('should propagate errors from use case', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'
      const error = new Error('User not found')

      findUserByUuidUseCase.execute.mockRejectedValue(error)

      await expect(controller.findOne(uuid)).rejects.toThrow(error)
    })
  })
})
