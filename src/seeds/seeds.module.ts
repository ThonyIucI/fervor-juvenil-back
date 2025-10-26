import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GuardianSchema } from '../guardian/infrastructure/persistence/guardian.schema'
import { RoleSchema } from '../role/infrastructure/persistence/role.schema'
import { UserRoleSchema } from '../role/infrastructure/persistence/user-role.schema'
import { UserSchema } from '../user/infrastructure/persistence/user.schema'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'

import { CsvImportService } from './csv-import.service'

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
  exports  : [ CsvImportService ]
})
export class SeedsModule {}
