import { Test, TestingModule } from '@nestjs/testing'

import { CreateUserDto } from '../../application/dto/create-user.dto'
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case'
import { User } from '../../domain/entities/user.entity'

import { CreateUserController } from './create-user.controller'

describe('CreateUserController', () => {
  let controller: CreateUserController
  let createUserUseCase: jest.Mocked<CreateUserUseCase>

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ CreateUserController ],
      providers  : [
        {
          provide : CreateUserUseCase,
          useValue: mockCreateUserUseCase
        }
      ]
    }).compile()

    controller = module.get<CreateUserController>(CreateUserController)
    createUserUseCase = module.get(CreateUserUseCase)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName : 'Doe',
      email    : 'john@example.com',
      password : 'password123'
    }

    it('should create a user and return response DTO', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')

      createUserUseCase.execute.mockResolvedValue(user)

      const result = await controller.create(createUserDto)

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto)
      expect(result).toBeDefined()
      expect(result.email).toBe('john@example.com')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result).not.toHaveProperty('password')
    })

    it('should propagate errors from use case', async () => {
      const error = new Error('Email already exists')

      createUserUseCase.execute.mockRejectedValue(error)

      await expect(controller.create(createUserDto)).rejects.toThrow(error)
    })
  })
})
