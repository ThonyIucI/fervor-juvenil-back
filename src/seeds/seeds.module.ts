import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CsvImportService } from './csv-import.service'
import { UserSchema } from '../user/infrastructure/persistence/user.schema'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'
import { GuardianSchema } from '../guardian/infrastructure/persistence/guardian.schema'
import { RoleSchema } from '../role/infrastructure/persistence/role.schema'
import { UserRoleSchema } from '../role/infrastructure/persistence/user-role.schema'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSchema,
      UserProfileSchema,
      GuardianSchema,
      RoleSchema,
      UserRoleSchema
    ])
  ],
  providers: [ CsvImportService ],
  exports: [ CsvImportService ]
})
export class SeedsModule {}
