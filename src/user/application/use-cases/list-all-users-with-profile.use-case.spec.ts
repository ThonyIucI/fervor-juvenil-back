import { Test, TestingModule } from '@nestjs/testing'

import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { User } from '../../domain/entities/user.entity'
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'

import { ListAllUsersWithProfileUseCase } from './list-all-users-with-profile.use-case'

describe('ListAllUsersWithProfileUseCase', () => {
  let useCase: ListAllUsersWithProfileUseCase
  let mockUserRepository: any

  const mockUser1 = User.reconstruct(
    'user-uuid-1',
    'John',
    'Doe',
    'john@example.com',
    'hashed-password',
    'john-doe',
    false,
    new Date(),
    new Date()
  )

  const mockUser2 = User.reconstruct(
    'user-uuid-2',
    'Jane',
    'Smith',
    'jane@example.com',
    'hashed-password',
    'jane-smith',
    false,
    new Date(),
    new Date()
  )

  const mockProfile1 = UserProfile.reconstruct(
    'profile-uuid-1',
    'user-uuid-1',
    {
      gender: 'M',
      age   : 25,
      status: 'A'
    },
    new Date(),
    new Date()
  )

  const mockProfile2 = UserProfile.reconstruct(
    'profile-uuid-2',
    'user-uuid-2',
    {
      gender: 'F',
      age   : 28,
      status: 'A'
    },
    new Date(),
    new Date()
  )

  beforeEach(async () => {
    mockUserRepository = {
      findAllWithProfile: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllUsersWithProfileUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockUserRepository
        }
      ]
    }).compile()

    useCase = module.get<ListAllUsersWithProfileUseCase>(ListAllUsersWithProfileUseCase)
  })

  describe('execute', () => {
    it('should return all users with their profiles', async () => {
      // Arrange
      mockUserRepository.findAllWithProfile.mockResolvedValue([
        { user: mockUser1, profile: mockProfile1 },
        { user: mockUser2, profile: mockProfile2 }
      ])

      // Act
      const result = await useCase.execute()

      // Assert
      expect(mockUserRepository.findAllWithProfile).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('user')
      expect(result[0]).toHaveProperty('profile')
      expect(result[1]).toHaveProperty('user')
      expect(result[1]).toHaveProperty('profile')
    })

    it('should return users with null profiles when profiles do not exist', async () => {
      // Arrange
      mockUserRepository.findAllWithProfile.mockResolvedValue([
        { user: mockUser1, profile: null },
        { user: mockUser2, profile: mockProfile2 }
      ])

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].profile).toBeNull()
      expect(result[1].profile).not.toBeNull()
    })

    it('should return empty array when no users exist', async () => {
      // Arrange
      mockUserRepository.findAllWithProfile.mockResolvedValue([])

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toEqual([])
    })
  })
})
