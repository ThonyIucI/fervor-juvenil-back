import { Test, TestingModule } from '@nestjs/testing'

import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { USER_PROFILE_REPOSITORY } from '../../../user-profile/domain/repositories/user-profile.repository.interface'
import { User } from '../../domain/entities/user.entity'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto'

import { UpdateCurrentUserProfileUseCase } from './update-current-user-profile.use-case'

describe('UpdateCurrentUserProfileUseCase', () => {
  let useCase: UpdateCurrentUserProfileUseCase
  let mockUserRepository: any
  let mockUserProfileRepository: any

  const mockUser = User.reconstruct(
    'user-uuid-123',
    'John',
    'Doe',
    'john@example.com',
    'hashed-password',
    'john-doe',
    false,
    new Date(),
    new Date()
  )

  const mockProfile = UserProfile.reconstruct(
    'profile-uuid-123',
    'user-uuid-123',
    {
      gender    : 'M',
      age       : 25,
      birthDate : new Date('1999-01-01'),
      status    : 'A',
      firstNames: 'John',
      lastNames : 'Doe'
    },
    new Date(),
    new Date()
  )

  beforeEach(async () => {
    mockUserRepository = {
      findByUuid: jest.fn(),
      save      : jest.fn()
    }

    mockUserProfileRepository = {
      findByUserUuid: jest.fn(),
      save          : jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCurrentUserProfileUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockUserRepository
        },
        {
          provide : USER_PROFILE_REPOSITORY,
          useValue: mockUserProfileRepository
        }
      ]
    }).compile()

    useCase = module.get<UpdateCurrentUserProfileUseCase>(UpdateCurrentUserProfileUseCase)
  })

  describe('execute', () => {
    it('should update user and profile successfully', async () => {
      // Arrange
      const updateDto: UpdateUserProfileDto = {
        firstName: 'Jane',
        lastName : 'Smith',
        age      : 26,
        shirtSize: 'L'
      }

      mockUserRepository.findByUuid.mockResolvedValue(mockUser)
      mockUserProfileRepository.findByUserUuid.mockResolvedValue(mockProfile)
      mockUserRepository.save.mockResolvedValue(mockUser)
      mockUserProfileRepository.save.mockResolvedValue(mockProfile)

      // Act
      const result = await useCase.execute('user-uuid-123', updateDto)

      // Assert
      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith('user-uuid-123')
      expect(mockUserProfileRepository.findByUserUuid).toHaveBeenCalledWith('user-uuid-123')
      expect(mockUserRepository.save).toHaveBeenCalled()
      expect(mockUserProfileRepository.save).toHaveBeenCalled()
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('profile')
    })

    it('should create profile if it does not exist', async () => {
      // Arrange
      const updateDto: UpdateUserProfileDto = {
        age   : 26,
        gender: 'F'
      }

      mockUserRepository.findByUuid.mockResolvedValue(mockUser)
      mockUserProfileRepository.findByUserUuid.mockResolvedValue(null)
      mockUserRepository.save.mockResolvedValue(mockUser)
      mockUserProfileRepository.save.mockResolvedValue(mockProfile)

      // Act
      await useCase.execute('user-uuid-123', updateDto)

      // Assert
      expect(mockUserProfileRepository.findByUserUuid).toHaveBeenCalledWith('user-uuid-123')
      expect(mockUserProfileRepository.save).toHaveBeenCalled()
    })

    it('should throw UserNotFoundException when user does not exist', async () => {
      // Arrange
      const updateDto: UpdateUserProfileDto = {
        age: 26
      }

      mockUserRepository.findByUuid.mockResolvedValue(null)

      // Act & Assert
      await expect(useCase.execute('non-existent-uuid', updateDto)).rejects.toThrow(
        UserNotFoundException
      )
    })

    it('should only update provided fields', async () => {
      // Arrange
      const updateDto: UpdateUserProfileDto = {
        shirtSize: 'XL'
      }

      mockUserRepository.findByUuid.mockResolvedValue(mockUser)
      mockUserProfileRepository.findByUserUuid.mockResolvedValue(mockProfile)
      mockUserRepository.save.mockResolvedValue(mockUser)
      mockUserProfileRepository.save.mockResolvedValue(mockProfile)

      // Act
      await useCase.execute('user-uuid-123', updateDto)

      // Assert
      expect(mockUserProfileRepository.save).toHaveBeenCalled()
    })

    it('should handle user data updates (firstName, lastName, email)', async () => {
      // Arrange
      const updateDto: UpdateUserProfileDto = {
        firstName: 'UpdatedName',
        lastName : 'UpdatedLastName',
        email    : 'updated@example.com'
      }

      mockUserRepository.findByUuid.mockResolvedValue(mockUser)
      mockUserProfileRepository.findByUserUuid.mockResolvedValue(mockProfile)
      mockUserRepository.save.mockResolvedValue(mockUser)
      mockUserProfileRepository.save.mockResolvedValue(mockProfile)

      // Act
      await useCase.execute('user-uuid-123', updateDto)

      // Assert
      expect(mockUserRepository.save).toHaveBeenCalled()
    })
  })
})
