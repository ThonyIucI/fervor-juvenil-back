import { User } from '../../domain/entities/user.entity'
import { UserSchema } from '../persistence/user.schema'

export class UserMapper {
  static toDomain(schema: UserSchema): User {
    return User.reconstruct(
      schema.uuid,
      schema.firstName,
      schema.lastName,
      schema.email,
      schema.password,
      schema.slug,
      schema.dni,
      schema.isGoogleAccount,
      schema.createdAt,
      schema.updatedAt
    )
  }

  static toPersistence(domain: User): UserSchema {
    const schema = new UserSchema()

    schema.uuid = domain.getUuid()
    schema.slug = domain.getSlug()
    schema.firstName = domain.getFirstName()
    schema.lastName = domain.getLastName()
    schema.email = domain.getEmail()
    schema.password = domain.getHashedPassword()
    schema.dni = domain.getDni()
    schema.isGoogleAccount = domain.getIsGoogleAccount()
    schema.createdAt = domain.getCreatedAt()
    schema.updatedAt = domain.getUpdatedAt()

    return schema
  }
}
