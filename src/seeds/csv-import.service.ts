import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import { uuidv7 } from 'uuidv7'

import { Guardian } from '../guardian/domain/entities/guardian.entity'
import { GuardianSchema } from '../guardian/infrastructure/persistence/guardian.schema'
import { Role } from '../role/domain/entities/role.entity'
import { RoleName } from '../role/domain/value-objects/role-name.vo'
import { RoleSchema } from '../role/infrastructure/persistence/role.schema'
import { UserRoleSchema } from '../role/infrastructure/persistence/user-role.schema'
import { User } from '../user/domain/entities/user.entity'
import { UserSchema } from '../user/infrastructure/persistence/user.schema'
import { UserProfile } from '../user-profile/domain/entities/user-profile.entity'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'

interface ImportResult {
  imported: number
  skipped: number
  errors: number
  errorDetails: Array<{ row: number; email: string; error: string }>
}

interface CsvRow {
  'Timestamp': string
  'Apellidos completos': string
  'Nombres completos': string
  'Género': string
  'Edad': string
  'N° de DNI': string
  'Fecha de nacimiento': string
  'Estado': string
  'Alias (nombre con el que se te conoce normalmente)': string
  'Tiene polo': string
  'Talla de polo (se considera talla completa)': string
  'Email Address': string
  'N° de celular (Si no tiene indicar alguno de referencia)': string
  'Fecha de inscripción (tome como referencia el primer día de ensayo)': string
  'Residencia actual (lugar en el que vive actualmente)': string
  'Talla de pantalón': string
  'Talla de zapato': string
  'Talla (en metros, por ejemplo: 1.67)': string
  'Peso (en kg, por ejemplo: 58)': string
  'Seguro de Salud': string
  'Tipo de sangre': string
  'Elementos a los que es alérgico (alimentos, medicamentos, etc.)': string
  'Discapacidad, molestia física, transtorno psicológico diagnosticado (discapacidad visual, problemas de columna, transtorno de ansiedad, etc.)': string
  'Nombres y apellidos completos de apoderado (a)': string
  'Número de celular de apoderado (a)': string
  'Correo electrónico del apoderado (a)': string
  'Nombre adicional de adulto encargado en caso no esté el apoderado': string
  'Número de celular adicional': string
  'Qué quiere ser después de terminar el colegio (médico, arquitecto, ganadero, electricista, policía, presidente, etc.)': string
  'Superhéroe o superheroína favorito(a) ': string
}

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name)
  private readonly BATCH_SIZE = 100

  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
    @InjectRepository(UserProfileSchema)
    private readonly userProfileRepository: Repository<UserProfileSchema>,
    @InjectRepository(GuardianSchema)
    private readonly guardianRepository: Repository<GuardianSchema>,
    @InjectRepository(RoleSchema)
    private readonly roleRepository: Repository<RoleSchema>,
    @InjectRepository(UserRoleSchema)
    private readonly userRoleRepository: Repository<UserRoleSchema>
  ) { }

  async importFromCsv(csvPath: string): Promise<ImportResult> {
    const result: ImportResult = {
      imported    : 0,
      skipped     : 0,
      errors      : 0,
      errorDetails: []
    }

    try {
      // Leer archivo CSV
      const fileContent = fs.readFileSync(csvPath, 'utf-8')
      const records: CsvRow[] = parse(fileContent, {
        columns         : true,
        skip_empty_lines: true,
        trim            : true,
        bom             : true
      })

      this.logger.log(`Procesando ${records.length} registros del CSV...`)

      // Obtener rol "user" por defecto
      const userRole = await this.roleRepository.findOne({
        where: { name: RoleName.USER }
      })

      if(!userRole) {
        throw new Error('Rol "user" no encontrado. Ejecuta las migraciones primero.')
      }

      const existingEmails: Set<string> = new Set()
      const usersToInsert: UserSchema[] = []
      const profilesToInsert: UserProfileSchema[] = []
      const rolesToInsert: UserRoleSchema[] = []
      const guardiansToInsert: GuardianSchema[] = []

      let rowIndex = 1

      for (const row of records) {
        rowIndex++

        try {
          const originalEmail = row['Email Address']?.trim()
          const dni = row['N° de DNI']?.trim()
          const firstName = row['Nombres completos']?.trim()
          const lastName = row['Apellidos completos']?.trim()

          if(!originalEmail || !dni || !firstName || !lastName || originalEmail.length < 5) {
            result.skipped++
            continue
          }

          // Determinar email final (original o modificado)
          const finalEmail = await this.resolveEmail(originalEmail, existingEmails)

          existingEmails.add(finalEmail)

          // Crear usuario
          const user = await User.create(
            firstName,
            lastName,
            finalEmail,
            dni,
            dni,
            false
          )

          // 2. Persistir usuario
          const userPrimitives = user.toPrimitives()
          const userSchema = this.userRepository.create({
            uuid           : userPrimitives.uuid,
            slug           : userPrimitives.slug,
            firstName      : userPrimitives.firstName,
            lastName       : userPrimitives.lastName,
            email          : userPrimitives.email,
            password       : userPrimitives.hashedPassword,
            dni            : userPrimitives.dni,
            isActive       : true,
            isGoogleAccount: userPrimitives.isGoogleAccount
          })

          usersToInsert.push(userSchema)

          // Crear asignación de rol
          const userRoleAssignment = this.userRoleRepository.create({
            uuid: uuidv7(),
            user: { uuid: userSchema.uuid } as UserSchema,
            role: { uuid: userRole.uuid } as RoleSchema
          })

          rolesToInsert.push(userRoleAssignment)

          // Crear perfil
          const userProfile = UserProfile.make(userSchema.uuid, {
            userUuid            : userSchema.uuid,
            lastNames           : row['Apellidos completos']?.trim(),
            firstNames          : row['Nombres completos']?.trim(),
            gender              : row['Género']?.trim(),
            age                 : this.parseNumber(row['Edad']),
            birthDate           : this.parseDate(row['Fecha de nacimiento']),
            status              : row['Estado']?.trim(),
            alias               : row['Alias (nombre con el que se te conoce normalmente)']?.trim(),
            hasUniform          : this.parseBoolean(row['Tiene polo']),
            shirtSize           : row['Talla de polo (se considera talla completa)']?.trim(),
            pantsSize           : row['Talla de pantalón']?.trim(),
            shoeSize            : row['Talla de zapato']?.trim(),
            heightMeters        : this.parseDecimal(row['Talla (en metros, por ejemplo: 1.67)']),
            weightKg            : this.parseDecimal(row['Peso (en kg, por ejemplo: 58)']),
            healthInsurance     : row['Seguro de Salud']?.trim(),
            bloodType           : row['Tipo de sangre']?.trim(),
            allergies           : row['Elementos a los que es alérgico (alimentos, medicamentos, etc.)']?.trim(),
            disabilityOrDisorder: row['Discapacidad, molestia física, transtorno psicológico diagnosticado (discapacidad visual, problemas de columna, transtorno de ansiedad, etc.)']?.trim(),
            enrollmentDate      : this.parseDate(row['Fecha de inscripción (tome como referencia el primer día de ensayo)']),
            currentResidence    : row['Residencia actual (lugar en el que vive actualmente)']?.trim(),
            professionalGoal    : row['Qué quiere ser después de terminar el colegio (médico, arquitecto, ganadero, electricista, policía, presidente, etc.)']?.trim(),
            favoriteHero        : row['Superhéroe o superheroína favorito(a) ']?.trim()
          })

          const profilePrimitives = userProfile.toPrimitives()
          const profileSchema = this.userProfileRepository.create({
            uuid                : profilePrimitives.uuid,
            user                : { uuid: userSchema.uuid } as UserSchema,
            lastNames           : profilePrimitives.lastNames,
            firstNames          : profilePrimitives.firstNames,
            gender              : profilePrimitives.gender,
            age                 : profilePrimitives.age,
            birthDate           : profilePrimitives.birthDate,
            status              : profilePrimitives.status,
            alias               : profilePrimitives.alias,
            hasUniform          : profilePrimitives.hasUniform,
            shirtSize           : profilePrimitives.shirtSize,
            pantsSize           : profilePrimitives.pantsSize,
            shoeSize            : profilePrimitives.shoeSize,
            heightMeters        : profilePrimitives.heightMeters,
            weightKg            : profilePrimitives.weightKg,
            healthInsurance     : profilePrimitives.healthInsurance,
            bloodType           : profilePrimitives.bloodType,
            allergies           : profilePrimitives.allergies,
            disabilityOrDisorder: profilePrimitives.disabilityOrDisorder,
            enrollmentDate      : profilePrimitives.enrollmentDate,
            currentResidence    : profilePrimitives.currentResidence,
            professionalGoal    : profilePrimitives.professionalGoal,
            favoriteHero        : profilePrimitives.favoriteHero,
            registrationDate    : profilePrimitives.registrationDate
          })

          profilesToInsert.push(profileSchema)

          // 5. Crear apoderados
          const userGuardians = this.createGuardiansData(row, userSchema.uuid)

          guardiansToInsert.push(...userGuardians)

          result.imported++

          // Procesar por lotes
          if(usersToInsert.length >= this.BATCH_SIZE) {
            await this.processBatch(usersToInsert, profilesToInsert, rolesToInsert, guardiansToInsert)
          }
        } catch (error) {
          result.errors++
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

          result.errorDetails.push({
            row  : rowIndex,
            email: row['Email Address'] || 'N/A',
            error: errorMessage
          })
          this.logger.error(`Fila ${rowIndex}: Error al importar - ${errorMessage}`)
        }
      }

      // Procesar los registros restantes
      if(usersToInsert.length > 0) {
        await this.processBatch(usersToInsert, profilesToInsert, rolesToInsert, guardiansToInsert)
      }

      this.logger.log('Importación completada')
      this.logger.log(`Importados: ${result.imported}, Saltados: ${result.skipped}, Errores: ${result.errors}`)

      return result
    } catch (error) {
      this.logger.error('Error al procesar archivo CSV', error)
      throw error
    }
  }

  /**
   * Procesa un lote completo de inserciones
   */
  private async processBatch(
    usersToInsert: UserSchema[],
    profilesToInsert: UserProfileSchema[],
    rolesToInsert: UserRoleSchema[],
    guardiansToInsert: GuardianSchema[]
  ): Promise<void> {
    try {
      await this.userRepository.insert(usersToInsert)
      await this.userProfileRepository.insert(profilesToInsert)
      await this.userRoleRepository.insert(rolesToInsert)

      if(guardiansToInsert.length > 0) {
        await this.guardianRepository.insert(guardiansToInsert)
      }

      this.logger.log(`Procesado lote de ${usersToInsert.length} usuarios`)

      // Limpiar arrays para el siguiente lote
      usersToInsert.length = 0
      profilesToInsert.length = 0
      rolesToInsert.length = 0
      guardiansToInsert.length = 0
    } catch (error) {
      this.logger.error('Error al procesar lote', error)
      throw error
    }
  }

  /**
   * Resuelve el email, modificándolo si ya existe
   */
  private async resolveEmail(originalEmail: string, existingEmails: Set<string>): Promise<string> {
    if(!existingEmails.has(originalEmail.toLocaleLowerCase())) {
      return originalEmail
    }

    // Generar email alternativo con número random
    let attempts = 0
    let newEmail = originalEmail

    while (attempts < 10) {
      const emailParts = originalEmail.split('@')
      const randomNum = Math.floor(Math.random() * 10)

      if(emailParts.length !== 2) {
        break
      }

      newEmail = `${emailParts[0]}${randomNum}@${emailParts[1]}`

      if(!existingEmails.has(newEmail)) {
        this.logger.warn(`Email ${originalEmail} ya existe, usando ${newEmail} en su lugar`)

        return newEmail
      }

      attempts++
    }

    // Si no se pudo generar un email único, usar timestamp
    const timestamp = Date.now()
    const emailParts = originalEmail.split('@')

    if(emailParts.length === 2) {
      newEmail = `${emailParts[0]}${timestamp}@${emailParts[1]}`
      this.logger.warn(`Email ${originalEmail} ya existe, usando ${newEmail} en su lugar`)
    }

    return newEmail
  }

  /**
   * Crea datos de apoderados para inserción masiva
   */

  // TODO: Reestructurar información de guardians para:
  //  - asociar un guardian con varios usuarios
  //  - poder hacer que tengan roles e inicien sesión
  private createGuardiansData(row: CsvRow, userUuid: string): GuardianSchema[] {
    const guardians: GuardianSchema[] = []

    // Apoderado principal
    const primaryGuardianName = row['Nombres y apellidos completos de apoderado (a)']?.trim()
    const primaryGuardianPhone = row['Número de celular de apoderado (a)']?.trim()
    const primaryGuardianEmail = row['Correo electrónico del apoderado (a)']?.trim()

    if(primaryGuardianName) {
      const guardian = Guardian.make({
        userUuid,
        fullName   : primaryGuardianName,
        phone      : primaryGuardianPhone,
        email      : primaryGuardianEmail,
        contactType: 'primary'
      })

      const guardianPrimitives = guardian.toPrimitives()
      const guardianSchema = this.guardianRepository.create({
        uuid       : guardianPrimitives.uuid,
        user       : { uuid: userUuid } as UserSchema,
        fullName   : guardianPrimitives.fullName,
        phone      : guardianPrimitives.phone,
        email      : guardianPrimitives.email,
        contactType: guardianPrimitives.contactType
      })

      guardians.push(guardianSchema)
    }

    // Contacto adicional
    const secondaryGuardianName = row['Nombre adicional de adulto encargado en caso no esté el apoderado']?.trim()
    const secondaryGuardianPhone = row['Número de celular adicional']?.trim()

    if(secondaryGuardianName) {
      const guardian = Guardian.make({
        userUuid,
        fullName   : secondaryGuardianName,
        phone      : secondaryGuardianPhone,
        contactType: 'secondary'
      })

      const guardianPrimitives = guardian.toPrimitives()
      const guardianSchema = this.guardianRepository.create({
        uuid       : guardianPrimitives.uuid,
        user       : { uuid: userUuid } as UserSchema,
        fullName   : guardianPrimitives.fullName,
        phone      : guardianPrimitives.phone,
        contactType: guardianPrimitives.contactType
      })

      guardians.push(guardianSchema)
    }

    return guardians
  }
  async createSuperadmin(): Promise<void> {
    const superadminEmail = 'affervorjuvenil@gmail.com'

    // Verificar si ya existe
    const existingSuperadmin = await this.userRepository.findOne({
      where: { email: superadminEmail }
    })

    if(existingSuperadmin) {
      this.logger.log('Superadmin ya existe, saltando...')

      return
    }

    // Buscar o crear rol superadmin
    let superadminRole = await this.roleRepository.findOne({
      where: { name: RoleName.SUPERADMIN }
    })

    if(!superadminRole) {
      // Usar entidad de dominio para crear rol
      const role = Role.make({
        name       : RoleName.SUPERADMIN,
        description: 'Super Administrator with full access'
      })

      const rolePrimitives = role.toPrimitives()

      superadminRole = this.roleRepository.create({
        uuid       : rolePrimitives.uuid,
        name       : rolePrimitives.name,
        description: rolePrimitives.description
      })
      await this.roleRepository.save(superadminRole)
    }

    // Crear usuario superadmin usando entidad de dominio
    const superadmin = await User.create(
      'Super',
      'Admin',
      superadminEmail,
      'admin123', // Password temporal (se hashea automáticamente)
      null, // No tiene DNI
      false
    )

    const userPrimitives = superadmin.toPrimitives()
    const superadminSchema = this.userRepository.create({
      uuid           : userPrimitives.uuid,
      slug           : userPrimitives.slug,
      firstName      : userPrimitives.firstName,
      lastName       : userPrimitives.lastName,
      email          : userPrimitives.email,
      password       : userPrimitives.hashedPassword,
      dni            : userPrimitives.dni,
      isActive       : true,
      isGoogleAccount: userPrimitives.isGoogleAccount
    })

    await this.userRepository.save(superadminSchema)

    // Asignar rol superadmin
    const userRole = this.userRoleRepository.create({
      uuid: uuidv7(),
      user: { uuid: superadminSchema.uuid } as UserSchema,
      role: { uuid: superadminRole.uuid } as RoleSchema
    })

    await this.userRoleRepository.save(userRole)

    this.logger.log(`Superadmin creado: ${superadminEmail}`)
  }

  // Métodos auxiliares de parsing (sin lógica de dominio)
  private parseNumber(value: string | undefined): number | undefined {
    if(!value || value.trim() === '') return undefined
    const num = parseInt(value.trim())

    return isNaN(num) ? undefined : num
  }

  private parseDecimal(value: string | undefined): number | undefined {
    if(!value || value.trim() === '') return undefined
    const normalized = value.trim().replace(',', '.')
    const num = parseFloat(normalized)

    return isNaN(num) ? undefined : num
  }

  private parseBoolean(value: string | undefined): boolean | undefined {
    if(!value) return undefined
    const normalized = value.trim().toLowerCase()

    if(normalized === 'sí' || normalized === 'si' || normalized === 'yes') return true
    if(normalized === 'no') return false

    return undefined
  }

  private parseDate(value: string | undefined): Date | undefined {
    if(!value || value.trim() === '') return undefined

    try {
      const parts = value.trim().split('/')

      if(parts.length === 3) {
        const month = parseInt(parts[0]) - 1
        const day = parseInt(parts[1])
        const year = parseInt(parts[2])

        return new Date(year, month, day)
      }

      return undefined
    } catch {
      return undefined
    }
  }
}
