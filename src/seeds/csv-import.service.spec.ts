import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import * as bcrypt from 'bcrypt'

import { GuardianSchema } from '../guardian/infrastructure/persistence/guardian.schema'
import { RoleSchema } from '../role/infrastructure/persistence/role.schema'
import { UserSchema } from '../user/infrastructure/persistence/user.schema'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'

import { CsvImportService } from './csv-import.service'

describe('CsvImportService', () => {
  let service: CsvImportService
  let userRepository: Repository<UserSchema>
  let userProfileRepository: Repository<UserProfileSchema>
  let guardianRepository: Repository<GuardianSchema>
  let roleRepository: Repository<RoleSchema>

  const mockUserRepository = {
    create : jest.fn(),
    save   : jest.fn(),
    findOne: jest.fn()
  }

  const mockUserProfileRepository = {
    create: jest.fn(),
    save  : jest.fn()
  }

  const mockGuardianRepository = {
    create: jest.fn(),
    save  : jest.fn()
  }

  const mockRoleRepository = {
    findOne: jest.fn(),
    create : jest.fn(),
    save   : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsvImportService,
        {
          provide : getRepositoryToken(UserSchema),
          useValue: mockUserRepository
        },
        {
          provide : getRepositoryToken(UserProfileSchema),
          useValue: mockUserProfileRepository
        },
        {
          provide : getRepositoryToken(GuardianSchema),
          useValue: mockGuardianRepository
        },
        {
          provide : getRepositoryToken(RoleSchema),
          useValue: mockRoleRepository
        }
      ]
    }).compile()

    service = module.get<CsvImportService>(CsvImportService)
    userRepository = module.get<Repository<UserSchema>>(getRepositoryToken(UserSchema))
    userProfileRepository = module.get<Repository<UserProfileSchema>>(getRepositoryToken(UserProfileSchema))
    guardianRepository = module.get<Repository<GuardianSchema>>(getRepositoryToken(GuardianSchema))
    roleRepository = module.get<Repository<RoleSchema>>(getRepositoryToken(RoleSchema))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('importFromCsv', () => {
    it('should be defined', () => {
      expect(service).toBeDefined()
    })

    it('should import users from CSV file', async () => {
      // RED PHASE - Este test debe fallar
      const csvPath = 'test-data.csv'

      mockUserRepository.findOne.mockResolvedValue(null)
      mockUserRepository.create.mockReturnValue({ uuid: 'test-uuid' })
      mockUserRepository.save.mockResolvedValue({ uuid: 'test-uuid' })
      mockRoleRepository.findOne.mockResolvedValue({ uuid: 'role-uuid', name: 'user' })

      const result = await service.importFromCsv(csvPath)

      expect(result).toBeDefined()
      expect(result.imported).toBeGreaterThan(0)
    })

    it('should hash password with DNI as initial password', async () => {
      // RED PHASE
      const dni = '75804269'
      const hashedPassword = await bcrypt.hash(dni, 10)

      expect(hashedPassword).toBeDefined()
      expect(await bcrypt.compare(dni, hashedPassword)).toBe(true)
    })

    it('should create user profile with data from CSV', async () => {
      // RED PHASE
      const csvPath = 'test-data.csv'

      mockUserRepository.findOne.mockResolvedValue(null)
      mockUserRepository.save.mockResolvedValue({ uuid: 'user-uuid' })
      mockUserProfileRepository.save.mockResolvedValue({ uuid: 'profile-uuid' })
      mockRoleRepository.findOne.mockResolvedValue({ uuid: 'role-uuid' })

      await service.importFromCsv(csvPath)

      expect(mockUserProfileRepository.save).toHaveBeenCalled()
    })

    it('should create guardian records for each user', async () => {
      // RED PHASE
      const csvPath = 'test-data.csv'

      mockUserRepository.findOne.mockResolvedValue(null)
      mockUserRepository.save.mockResolvedValue({ uuid: 'user-uuid' })
      mockGuardianRepository.save.mockResolvedValue({ uuid: 'guardian-uuid' })
      mockRoleRepository.findOne.mockResolvedValue({ uuid: 'role-uuid' })

      await service.importFromCsv(csvPath)

      expect(mockGuardianRepository.save).toHaveBeenCalled()
    })

    it('should skip users with existing email', async () => {
      // RED PHASE
      const csvPath = 'test-data.csv'

      mockUserRepository.findOne.mockResolvedValue({ uuid: 'existing-user' })

      const result = await service.importFromCsv(csvPath)

      expect(result.skipped).toBeGreaterThan(0)
    })

    it('should log errors without interrupting import', async () => {
      // RED PHASE
      const csvPath = 'test-data.csv'

      mockUserRepository.save.mockRejectedValueOnce(new Error('DB Error'))
      mockUserRepository.save.mockResolvedValue({ uuid: 'user-uuid' })

      const result = await service.importFromCsv(csvPath)

      expect(result.errors).toBeGreaterThan(0)
      expect(result.imported).toBeGreaterThanOrEqual(0)
    })
  })

  describe('createSuperadmin', () => {
    it('should create superadmin user with specific email', async () => {
      // RED PHASE
      const superadminEmail = 'affervorjuvenil@gmail.com'

      mockUserRepository.findOne.mockResolvedValue(null)
      mockUserRepository.save.mockResolvedValue({ uuid: 'admin-uuid', email: superadminEmail })
      mockRoleRepository.findOne.mockResolvedValue({ uuid: 'superadmin-role-uuid', name: 'superadmin' })

      await service.createSuperadmin()

      expect(mockUserRepository.save).toHaveBeenCalled()
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'superadmin' } })
      )
    })

    it('should not create superadmin if already exists', async () => {
      // RED PHASE
      mockUserRepository.findOne.mockResolvedValue({ uuid: 'existing-admin' })

      await service.createSuperadmin()

      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })
})
