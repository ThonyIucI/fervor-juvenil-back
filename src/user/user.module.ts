import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Application - Use Cases
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case'
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case'
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case'
import { FindUserByUuidUseCase } from './application/use-cases/find-user-by-uuid.use-case'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { ValidateCredentialsUseCase } from './application/use-cases/validate-credentials.use-case'
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface'
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository'
// Infrastructure
import { UserSchema } from './infrastructure/persistence/user.schema'
// Presentation - Controllers
import { CreateUserController } from './presentation/controllers/create-user.controller'
import { DeleteUserController } from './presentation/controllers/delete-user.controller'
import { FindUserController } from './presentation/controllers/find-user.controller'
import { UpdateUserController } from './presentation/controllers/update-user.controller'

@Module({
  imports    : [ TypeOrmModule.forFeature([ UserSchema ]) ],
  controllers: [
    CreateUserController,
    FindUserController,
    UpdateUserController,
    DeleteUserController
  ],
  providers: [
    // Repository
    {
      provide : USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    },
    // Use Cases
    CreateUserUseCase,
    FindUserByUuidUseCase,
    FindUserByEmailUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ValidateCredentialsUseCase
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
