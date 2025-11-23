import { Test, TestingModule } from '@nestjs/testing'

import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { User } from '../../domain/entities/user.entity'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

import { GetCurrentUserProfileUseCase } from './get-current-user-profile.use-case'

describe('GetCurrentUserProfileUseCase', () => {
  let useCase: GetCurrentUserProfileUseCase
  let mockUserRepository: any

  const mockUser = User.reconstruct(
    'user-uuid-123',
    'John',
    'Doe',
    'john@example.com',
    'hashed-password',
    'john-doe',
    null,
    false,
    new Date(),
    new Date()
  )

  const mockProfile = UserProfile.reconstruct(
    'profile-uuid-123',
    'user-uuid-123',
    {
      gender      : 'M',
      age         : 25,
      birthDate   : new Date('1999-01-01'),
      status      : 'A',
      firstNames  : 'John',
      lastNames   : 'Doe',
      heightMeters: 1.75,
      weightKg    : 70,
      shoeSize    : '42',
      shirtSize   : 'M',
      pantsSize   : '32',
      bloodType   : 'O+'
    },
    new Date(),
    new Date()
  )

  beforeEach(async () => {
    mockUserRepository = {
      findByUuidWithProfile: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentUserProfileUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockUserRepository
        }
      ]
    }).compile()

    useCase = module.get<GetCurrentUserProfileUseCase>(GetCurrentUserProfileUseCase)
  })

  describe('execute', () => {
    it('should return user with profile when user exists', async () => {
      // Arrange
      mockUserRepository.findByUuidWithProfile.mockResolvedValue({
        user   : mockUser,
        profile: mockProfile
      })

      // Act
      const result = await useCase.execute('user-uuid-123')

      // Assert
      expect(mockUserRepository.findByUuidWithProfile).toHaveBeenCalledWith('user-uuid-123')
      expect(result).toEqual({
        user   : mockUser,
        profile: mockProfile
      })
    })

    it('should return user with null profile when profile does not exist', async () => {
      // Arrange
      mockUserRepository.findByUuidWithProfile.mockResolvedValue({
        user   : mockUser,
        profile: null
      })

      // Act
      const result = await useCase.execute('user-uuid-123')

      // Assert
      expect(result).toEqual({
        user   : mockUser,
        profile: null
      })
    })

    it('should throw UserNotFoundException when user does not exist', async () => {
      // Arrange
      mockUserRepository.findByUuidWithProfile.mockResolvedValue(null)

      // Act & Assert
      await expect(useCase.execute('non-existent-uuid')).rejects.toThrow(UserNotFoundException)
    })

    it('should throw UserNotFoundException with correct message', async () => {
      // Arrange
      mockUserRepository.findByUuidWithProfile.mockResolvedValue(null)

      // Act & Assert
      await expect(useCase.execute('non-existent-uuid')).rejects.toThrow('Usuario no encontrado')
    })
  })
})
