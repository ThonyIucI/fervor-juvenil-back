import { Test, TestingModule } from '@nestjs/testing'

import { User } from '../../domain/entities/user.entity'
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'
import { CreateUserDto } from '../dto/create-user.dto'

import { CreateUserUseCase } from './create-user.use-case'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
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
        CreateUserUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockRepository
        }
      ]
    }).compile()

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    const validDto: CreateUserDto = {
      firstName: 'John',
      lastName : 'Doe',
      email    : 'john@example.com',
      password : 'password123'
    }

    it('should create a new user successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null)
      mockRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await useCase.execute(validDto)

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com')
      expect(mockRepository.save).toHaveBeenCalled()
      expect(result).toBeInstanceOf(User)
      expect(result.getEmail()).toBe('john@example.com')
      expect(result.getFirstName()).toBe('John')
      expect(result.getLastName()).toBe('Doe')
    })

    it('should throw UserAlreadyExistsException when email exists', async () => {
      const existingUser = await User.create('Jane', 'Doe', 'john@example.com', 'password123')

      mockRepository.findByEmail.mockResolvedValue(existingUser)

      await expect(useCase.execute(validDto)).rejects.toThrow(UserAlreadyExistsException)
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should throw error for invalid email', async () => {
      const invalidDto = { ...validDto, email: 'invalid-email' }

      mockRepository.findByEmail.mockResolvedValue(null)

      await expect(useCase.execute(invalidDto)).rejects.toThrow()
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should throw error for short password', async () => {
      const invalidDto = { ...validDto, password: '123' }

      mockRepository.findByEmail.mockResolvedValue(null)

      await expect(useCase.execute(invalidDto)).rejects.toThrow()
      expect(mockRepository.save).not.toHaveBeenCalled()
    })
  })
})
