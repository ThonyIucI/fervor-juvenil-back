import { Test, TestingModule } from '@nestjs/testing'

import { SortOrder } from '../../../common/types/pagination.types'
import { UserProfile } from '../../../user-profile/domain/entities/user-profile.entity'
import { User } from '../../domain/entities/user.entity'
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface'
import { UserQueryParams } from '../../domain/types/user-query.types'

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
    true,
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
    true,
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
      findPaginated: jest.fn()
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

    useCase = module.get<ListAllUsersWithProfileUseCase>(
      ListAllUsersWithProfileUseCase
    )
  })

  describe('execute', () => {
    it('should return paginated users with default params', async () => {
      // Arrange
      mockUserRepository.findPaginated.mockResolvedValue({
        users: [
          { user: mockUser1, profile: mockProfile1 },
          { user: mockUser2, profile: mockProfile2 }
        ],
        total: 2
      })

      // Act
      const result = await useCase.execute()

      // Assert
      expect(mockUserRepository.findPaginated).toHaveBeenCalledWith({
        page     : 1,
        limit    : 10,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC,
        isActive : undefined,
        search   : undefined
      })
      expect(result.users).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it('should return paginated users with custom params', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 2,
        limit    : 5,
        sortBy   : 'email',
        sortOrder: SortOrder.DESC,
        isActive : true,
        search   : 'John'
      }

      mockUserRepository.findPaginated.mockResolvedValue({
        users: [ { user: mockUser1, profile: mockProfile1 } ],
        total: 1
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(mockUserRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(1)
    })

    it('should return users with null profiles when profiles do not exist', async () => {
      // Arrange
      mockUserRepository.findPaginated.mockResolvedValue({
        users: [
          { user: mockUser1, profile: null },
          { user: mockUser2, profile: mockProfile2 }
        ],
        total: 2
      })

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result.users).toHaveLength(2)
      expect(result.users[0].profile).toBeNull()
      expect(result.users[1].profile).not.toBeNull()
    })

    it('should return empty array when no users exist', async () => {
      // Arrange
      mockUserRepository.findPaginated.mockResolvedValue({
        users: [],
        total: 0
      })

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result.users).toEqual([])
      expect(result.total).toBe(0)
    })

    it('should filter by active users', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC,
        isActive : true
      }

      mockUserRepository.findPaginated.mockResolvedValue({
        users: [
          { user: mockUser1, profile: mockProfile1 },
          { user: mockUser2, profile: mockProfile2 }
        ],
        total: 2
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(mockUserRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(2)
    })

    it('should apply search filter', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC,
        search   : 'Jane'
      }

      mockUserRepository.findPaginated.mockResolvedValue({
        users: [ { user: mockUser2, profile: mockProfile2 } ],
        total: 1
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(mockUserRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(1)
    })
  })
})
