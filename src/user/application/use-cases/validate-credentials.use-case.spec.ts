import { Test, TestingModule } from '@nestjs/testing'

import { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

import { ValidateCredentialsUseCase } from './validate-credentials.use-case'

describe('ValidateCredentialsUseCase', () => {
  let useCase: ValidateCredentialsUseCase
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
        ValidateCredentialsUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockRepository
        }
      ]
    }).compile()

    useCase = module.get<ValidateCredentialsUseCase>(ValidateCredentialsUseCase)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should return user for valid credentials', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')

      mockRepository.findByEmail.mockResolvedValue(user)

      const result = await useCase.execute('john@example.com', 'password123')

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com')
      expect(result).toBe(user)
    })

    it('should throw InvalidCredentialsException when user not found', async () => {
      mockRepository.findByEmail.mockResolvedValue(null)

      await expect(useCase.execute('nonexistent@example.com', 'password123')).rejects.toThrow(
        InvalidCredentialsException
      )
    })

    it('should throw InvalidCredentialsException for wrong password', async () => {
      const user = await User.create('John', 'Doe', 'john@example.com', 'password123')

      mockRepository.findByEmail.mockResolvedValue(user)

      await expect(useCase.execute('john@example.com', 'wrongpassword')).rejects.toThrow(
        InvalidCredentialsException
      )
    })

    it('should throw InvalidCredentialsException with message', async () => {
      mockRepository.findByEmail.mockResolvedValue(null)

      await expect(useCase.execute('test@example.com', 'password')).rejects.toThrow('Credenciales inválidas')
    })
  })
})
