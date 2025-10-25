import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import { v7 as uuidv7 } from 'uuid'

import { UserSchema } from '../user/infrastructure/persistence/user.schema'
import { UserProfileSchema } from '../user-profile/infrastructure/persistence/user-profile.schema'
import { GuardianSchema } from '../guardian/infrastructure/persistence/guardian.schema'
import { RoleSchema } from '../role/infrastructure/persistence/role.schema'
import { UserRoleSchema } from '../role/infrastructure/persistence/user-role.schema'

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
  ) {}

  async importFromCsv(csvPath: string): Promise<ImportResult> {
    const result: ImportResult = {
      imported: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    }

    try {
      // Leer archivo CSV
      const fileContent = fs.readFileSync(csvPath, 'utf-8')
      const records: CsvRow[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true
      })

      this.logger.log(`Procesando ${records.length} registros del CSV...`)

      // Obtener rol "user" por defecto
      const userRole = await this.roleRepository.findOne({
        where: { name: 'user' }
      })

      if (!userRole) {
        throw new Error('Rol "user" no encontrado. Ejecuta las migraciones primero.')
      }

      let rowIndex = 1
      for (const row of records) {
        rowIndex++

        try {
          // Validar datos mínimos requeridos
          const email = row['Email Address']?.trim()
          const dni = row['N° de DNI']?.trim()
          const firstName = row['Nombres completos']?.trim()
          const lastName = row['Apellidos completos']?.trim()

          // Saltar filas vacías o incompletas
          if (!email || !dni || !firstName || !lastName || email.length < 5) {
            this.logger.warn(`Fila ${rowIndex}: Datos incompletos, saltando...`)
            result.skipped++
            continue
          }

          // Verificar si el usuario ya existe
          const existingUser = await this.userRepository.findOne({
            where: { email }
          })

          if (existingUser) {
            this.logger.warn(`Fila ${rowIndex}: Usuario con email ${email} ya existe, saltando...`)
            result.skipped++
            continue
          }

          // Crear usuario
          const userUuid = uuidv7()
          const hashedPassword = await bcrypt.hash(dni, 10)

          const user = this.userRepository.create({
            uuid: userUuid,
            slug: this.generateSlug(firstName, lastName),
            firstName,
            lastName,
            email,
            dni,
            password: hashedPassword,
            isActive: true,
            isGoogleAccount: false
          })

          await this.userRepository.save(user)

          // Asignar rol "user"
          const userRoleUuid = uuidv7()
          const userRoleAssignment = this.userRoleRepository.create({
            uuid: userRoleUuid,
            user: { uuid: userUuid } as UserSchema,
            role: { uuid: userRole.uuid } as RoleSchema
          })
          await this.userRoleRepository.save(userRoleAssignment)

          // Crear perfil de usuario
          await this.createUserProfile(row, userUuid)

          // Crear apoderados
          await this.createGuardians(row, userUuid)

          result.imported++
          this.logger.log(`Fila ${rowIndex}: Usuario ${email} importado exitosamente`)
        } catch (error) {
          result.errors++
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
          result.errorDetails.push({
            row: rowIndex,
            email: row['Email Address'] || 'N/A',
            error: errorMessage
          })
          this.logger.error(`Fila ${rowIndex}: Error al importar - ${errorMessage}`)
        }
      }

      this.logger.log('Importación completada')
      this.logger.log(`Importados: ${result.imported}, Saltados: ${result.skipped}, Errores: ${result.errors}`)

      return result
    } catch (error) {
      this.logger.error('Error al procesar archivo CSV', error)
      throw error
    }
  }

  private async createUserProfile(row: CsvRow, userUuid: string): Promise<void> {
    const profileUuid = uuidv7()

    const profile = this.userProfileRepository.create({
      uuid: profileUuid,
      user: { uuid: userUuid } as UserSchema,
      lastNames: row['Apellidos completos']?.trim(),
      firstNames: row['Nombres completos']?.trim(),
      gender: row['Género']?.trim(),
      age: this.parseNumber(row['Edad']),
      birthDate: this.parseDate(row['Fecha de nacimiento']),
      status: row['Estado']?.trim(),
      alias: row['Alias (nombre con el que se te conoce normalmente)']?.trim(),
      hasUniform: this.parseBoolean(row['Tiene polo']),
      shirtSize: row['Talla de polo (se considera talla completa)']?.trim(),
      pantsSize: row['Talla de pantalón']?.trim(),
      shoeSize: row['Talla de zapato']?.trim(),
      heightMeters: this.parseDecimal(row['Talla (en metros, por ejemplo: 1.67)']),
      weightKg: this.parseDecimal(row['Peso (en kg, por ejemplo: 58)']),
      healthInsurance: row['Seguro de Salud']?.trim(),
      bloodType: row['Tipo de sangre']?.trim(),
      allergies: row['Elementos a los que es alérgico (alimentos, medicamentos, etc.)']?.trim(),
      disabilityOrDisorder: row['Discapacidad, molestia física, transtorno psicológico diagnosticado (discapacidad visual, problemas de columna, transtorno de ansiedad, etc.)']?.trim(),
      enrollmentDate: this.parseDate(row['Fecha de inscripción (tome como referencia el primer día de ensayo)']),
      currentResidence: row['Residencia actual (lugar en el que vive actualmente)']?.trim(),
      professionalGoal: row['Qué quiere ser después de terminar el colegio (médico, arquitecto, ganadero, electricista, policía, presidente, etc.)']?.trim(),
      favoriteHero: row['Superhéroe o superheroína favorito(a) ']?.trim()
    })

    await this.userProfileRepository.save(profile)
  }

  private async createGuardians(row: CsvRow, userUuid: string): Promise<void> {
    // Apoderado principal
    const primaryGuardianName = row['Nombres y apellidos completos de apoderado (a)']?.trim()
    const primaryGuardianPhone = row['Número de celular de apoderado (a)']?.trim()
    const primaryGuardianEmail = row['Correo electrónico del apoderado (a)']?.trim()

    if (primaryGuardianName) {
      const guardianUuid = uuidv7()
      const guardian = this.guardianRepository.create({
        uuid: guardianUuid,
        user: { uuid: userUuid } as UserSchema,
        fullName: primaryGuardianName,
        phone: primaryGuardianPhone,
        email: primaryGuardianEmail,
        contactType: 'primary'
      })
      await this.guardianRepository.save(guardian)
    }

    // Contacto adicional
    const secondaryGuardianName = row['Nombre adicional de adulto encargado en caso no esté el apoderado']?.trim()
    const secondaryGuardianPhone = row['Número de celular adicional']?.trim()

    if (secondaryGuardianName) {
      const guardianUuid = uuidv7()
      const guardian = this.guardianRepository.create({
        uuid: guardianUuid,
        user: { uuid: userUuid } as UserSchema,
        fullName: secondaryGuardianName,
        phone: secondaryGuardianPhone,
        contactType: 'secondary'
      })
      await this.guardianRepository.save(guardian)
    }
  }

  async createSuperadmin(): Promise<void> {
    const superadminEmail = 'affervorjuvenil@gmail.com'

    // Verificar si ya existe
    const existingSuperadmin = await this.userRepository.findOne({
      where: { email: superadminEmail }
    })

    if (existingSuperadmin) {
      this.logger.log('Superadmin ya existe, saltando...')
      return
    }

    // Buscar o crear rol superadmin
    let superadminRole = await this.roleRepository.findOne({
      where: { name: 'superadmin' }
    })

    if (!superadminRole) {
      const roleUuid = uuidv7()
      superadminRole = this.roleRepository.create({
        uuid: roleUuid,
        name: 'superadmin',
        description: 'Super Administrator with full access'
      })
      await this.roleRepository.save(superadminRole)
    }

    // Crear usuario superadmin
    const userUuid = uuidv7()
    const hashedPassword = await bcrypt.hash('admin123', 10) // Password temporal

    const superadmin = this.userRepository.create({
      uuid: userUuid,
      slug: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      email: superadminEmail,
      password: hashedPassword,
      isActive: true,
      isGoogleAccount: false
    })

    await this.userRepository.save(superadmin)

    // Asignar rol superadmin
    const userRoleUuid = uuidv7()
    const userRole = this.userRoleRepository.create({
      uuid: userRoleUuid,
      user: { uuid: userUuid } as UserSchema,
      role: { uuid: superadminRole.uuid } as RoleSchema
    })
    await this.userRoleRepository.save(userRole)

    this.logger.log(`Superadmin creado: ${superadminEmail}`)
  }

  // Métodos auxiliares
  private generateSlug(firstName: string, lastName: string): string {
    return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
  }

  private parseNumber(value: string | undefined): number | undefined {
    if (!value || value.trim() === '') return undefined
    const num = parseInt(value.trim())
    return isNaN(num) ? undefined : num
  }

  private parseDecimal(value: string | undefined): number | undefined {
    if (!value || value.trim() === '') return undefined
    // Manejar formato con coma o punto
    const normalized = value.trim().replace(',', '.')
    const num = parseFloat(normalized)
    return isNaN(num) ? undefined : num
  }

  private parseBoolean(value: string | undefined): boolean | undefined {
    if (!value) return undefined
    const normalized = value.trim().toLowerCase()
    if (normalized === 'sí' || normalized === 'si' || normalized === 'yes') return true
    if (normalized === 'no') return false
    return undefined
  }

  private parseDate(value: string | undefined): Date | undefined {
    if (!value || value.trim() === '') return undefined

    try {
      // Formato MM/DD/YYYY del CSV
      const parts = value.trim().split('/')
      if (parts.length === 3) {
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
