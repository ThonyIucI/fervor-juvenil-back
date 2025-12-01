import { Test, TestingModule } from '@nestjs/testing'

import { SortOrder } from '../../../common/types/pagination.types'
import {
  IUserRepository,
  USER_REPOSITORY
} from '../../domain/repositories/user.repository.interface'
import { UserQueryParams } from '../../domain/types/user-query.types'

import { GetPaginatedUsersUseCase } from './get-paginated-users.use-case'

describe('GetPaginatedUsersUseCase', () => {
  let useCase: GetPaginatedUsersUseCase
  let userRepository: jest.Mocked<IUserRepository>

  const mockUsers = [
    {
      user: {
        uuid     : '1',
        firstName: 'Ana',
        lastName : 'García',
        email    : 'ana@test.com',
        isActive : true,
        createdAt: new Date('2024-01-01')
      },
      profile: { bloodType: 'O+' }
    },
    {
      user: {
        uuid     : '2',
        firstName: 'Bruno',
        lastName : 'López',
        email    : 'bruno@test.com',
        isActive : true,
        createdAt: new Date('2024-01-02')
      },
      profile: { bloodType: 'A+' }
    },
    {
      user: {
        uuid     : '3',
        firstName: 'Carlos',
        lastName : 'Martínez',
        email    : 'carlos@test.com',
        isActive : false,
        createdAt: new Date('2024-01-03')
      },
      profile: null
    }
  ]

  beforeEach(async () => {
    const mockUserRepository = {
      findPaginated: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPaginatedUsersUseCase,
        {
          provide : USER_REPOSITORY,
          useValue: mockUserRepository
        }
      ]
    }).compile()

    useCase = module.get<GetPaginatedUsersUseCase>(GetPaginatedUsersUseCase)
    userRepository = module.get(USER_REPOSITORY)
  })

  describe('execute', () => {
    it('should return paginated users with default params', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: mockUsers.slice(0, 2),
        total: 2
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it('should filter by active users first', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        isActive : true,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: mockUsers.filter((u) => u.user.isActive),
        total: 2
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(2)
      expect(result.users.every((u) => u.user.isActive)).toBe(true)
    })

    it('should apply search filter', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        search   : 'García',
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: [ mockUsers[0] ],
        total: 1
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(1)
      expect(result.users[0].user.lastName).toBe('García')
    })

    it('should sort by specified field and order', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        sortBy   : 'createdAt',
        sortOrder: SortOrder.DESC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: [ ...mockUsers ].reverse(),
        total: 3
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users[0].user.uuid).toBe('3')
    })

    it('should handle pagination correctly', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 2,
        limit    : 1,
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: [ mockUsers[1] ],
        total: 3
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(1)
      expect(result.total).toBe(3)
    })

    it('should return empty array when no users match criteria', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        search   : 'NoExiste',
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: [],
        total: 0
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(result.users).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should combine multiple filters', async () => {
      // Arrange
      const params: UserQueryParams = {
        page     : 1,
        limit    : 10,
        isActive : true,
        search   : 'López',
        sortBy   : 'lastName',
        sortOrder: SortOrder.ASC
      }

      userRepository.findPaginated.mockResolvedValue({
        users: [ mockUsers[1] ],
        total: 1
      })

      // Act
      const result = await useCase.execute(params)

      // Assert
      expect(userRepository.findPaginated).toHaveBeenCalledWith(params)
      expect(result.users).toHaveLength(1)
      expect(result.users[0].user.isActive).toBe(true)
      expect(result.users[0].user.lastName).toBe('López')
    })
  })
})
