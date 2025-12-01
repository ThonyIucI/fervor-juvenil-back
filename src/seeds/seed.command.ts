import { NestFactory } from '@nestjs/core'

import * as path from 'path'

import { AppModule } from '../app.module'

import { CsvImportService } from './csv-import.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const csvImportService = app.get(CsvImportService)

  try {
    console.log('🚀 Iniciando importación de datos...\n')

    // 1. Crear roles si no existen
    console.log('📝 Creando roles...')
    await createRoles(app)

    // 2. Crear superadmin
    console.log('\n👤 Creando superadmin...')
    await csvImportService.createSuperadmin()

    // 3. Importar usuarios desde CSV
    const csvPath = process.argv[2] || path.join(process.cwd(), 'data.csv')

    console.log(`\n📊 Importando usuarios desde: ${csvPath}`)

    const result = await csvImportService.importFromCsv(csvPath)

    console.log('\n✅ Importación completada!')
    console.log(`   • Importados: ${result.imported}`)
    console.log(`   • Saltados: ${result.skipped}`)
    console.log(`   • Errores: ${result.errors}`)

    if(result.errorDetails.length > 0) {
      console.log('\n⚠️  Detalles de errores:')
      result.errorDetails.forEach(detail => {
        console.log(`   Fila ${detail.row} (${detail.email}): ${detail.error}`)
      })
    }
  } catch (error) {
    console.error('❌ Error durante la importación:', error)
    process.exit(1)
  } finally {
    await app.close()
  }
}

async function createRoles(app: any) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DataSource } = require('typeorm')
  const dataSource: typeof DataSource = app.get(DataSource)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { uuidv7 } = require('uuidv7')

  const roles = [
    { name: 'superadmin', description: 'Super Administrator with full access' },
    { name: 'admin', description: 'Administrator with limited access' },
    { name: 'user', description: 'Regular user' }
  ]

  for (const roleData of roles) {
    const existing = await dataSource.query(
      'SELECT * FROM roles WHERE name = $1',
      [ roleData.name ]
    )

    if(existing.length === 0) {
      await dataSource.query(
        'INSERT INTO roles (uuid, name, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [ uuidv7(), roleData.name, roleData.description ]
      )
      console.log(`   ✓ Rol "${roleData.name}" creado`)
    } else {
      console.log(`   • Rol "${roleData.name}" ya existe`)
    }
  }
}

bootstrap()
