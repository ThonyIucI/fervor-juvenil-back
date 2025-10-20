import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { config } from 'dotenv'

// Cargar .env desde la raíz del proyecto
config()

// Si existe DATABASE_URL (producción en Render), usarla
const databaseUrl = process.env.DATABASE_URL

export default new DataSource(
  databaseUrl ? {
    type          : 'postgres',
    url           : databaseUrl,
    entities      : [ 'src/**/*.entity.{ts,js}' ],
    migrations    : [ 'src/database/migrations/*.{ts,js}' ],
    synchronize   : false,
    namingStrategy: new SnakeNamingStrategy(),
    ssl           : { rejectUnauthorized: false }
  } : {
    type          : 'postgres',
    host          : process.env.DB_HOST,
    port          : parseInt(process.env.DB_PORT ?? '5432'),
    username      : process.env.DB_USERNAME,
    password      : process.env.DB_PASSWORD,
    database      : process.env.DB_NAME,
    entities      : [ 'src/**/*.entity.{ts,js}' ],
    migrations    : [ 'src/database/migrations/*.{ts,js}' ],
    synchronize   : false,
    namingStrategy: new SnakeNamingStrategy()
  })
