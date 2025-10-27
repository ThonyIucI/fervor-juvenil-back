import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { USER_PROFILE_REPOSITORY } from '../user-profile/domain/repositories/user-profile.repository.interface'
import { TypeOrmUserProfileRepository } from '../user-profile/infrastructure/persistence/typeorm-user-profile.repository'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'

// Application - Use Cases
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case'
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case'
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case'
import { FindUserByUuidUseCase } from './application/use-cases/find-user-by-uuid.use-case'
import { GetCurrentUserProfileUseCase } from './application/use-cases/get-current-user-profile.use-case'
import { ListAllUsersWithProfileUseCase } from './application/use-cases/list-all-users-with-profile.use-case'
import { UpdateCurrentUserProfileUseCase } from './application/use-cases/update-current-user-profile.use-case'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { ValidateCredentialsUseCase } from './application/use-cases/validate-credentials.use-case'
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface'
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository'
// Infrastructure
import { UserSchema } from './infrastructure/persistence/user.schema'
// Presentation - Controllers
import { AdminUsersController } from './presentation/controllers/admin-users.controller'
import { CreateUserController } from './presentation/controllers/create-user.controller'
import { DeleteUserController } from './presentation/controllers/delete-user.controller'
import { FindUserController } from './presentation/controllers/find-user.controller'
import { UpdateUserController } from './presentation/controllers/update-user.controller'
import { UserProfileController } from './presentation/controllers/user-profile.controller'

@Module({
  imports    : [ TypeOrmModule.forFeature([ UserSchema, UserProfileSchema ]) ],
  controllers: [
    CreateUserController,
    FindUserController,
    UpdateUserController,
    DeleteUserController,
    UserProfileController,
    AdminUsersController
  ],
  providers: [
    // Repositories
    {
      provide : USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    },
    {
      provide : USER_PROFILE_REPOSITORY,
      useClass: TypeOrmUserProfileRepository
    },
    // Use Cases
    CreateUserUseCase,
    FindUserByUuidUseCase,
    FindUserByEmailUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ValidateCredentialsUseCase,
    GetCurrentUserProfileUseCase,
    UpdateCurrentUserProfileUseCase,
    ListAllUsersWithProfileUseCase
  ],
  exports: [
    // Exportamos los casos de uso para que puedan ser usados por otros módulos (ej: Auth)
    CreateUserUseCase,
    FindUserByUuidUseCase,
    FindUserByEmailUseCase,
    ValidateCredentialsUseCase
  ]
})
export class UserModule {}
