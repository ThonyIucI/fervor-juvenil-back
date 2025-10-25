import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { config } from 'dotenv'

config({
  path: '.env'
})

// Prioriza DATABASE_URL si está disponible, sino usa variables individuales
const dataSourceConfig = process.env.DATABASE_URL
  ? {
    type          : 'postgres' as const,
    url           : process.env.DATABASE_URL,
    entities      : [ 'src/**/*.entity.{ts,js}', 'src/**/*.schema.{ts,js}' ],
    migrations    : [ 'src/database/migrations/*.{ts,js}' ],
    synchronize   : false,
    namingStrategy: new SnakeNamingStrategy(),
    ssl           : {
      rejectUnauthorized: false // Necesario para conexiones remotas como Render
    }
  }
  : {
    type          : 'postgres' as const,
    host          : process.env.DB_HOST,
    port          : parseInt(process.env.DB_PORT ?? '5432'),
    username      : process.env.DB_USERNAME,
    password      : process.env.DB_PASSWORD,
    database      : process.env.DB_NAME,
    entities      : [ 'src/**/*.entity.{ts,js}', 'src/**/*.schema.{ts,js}' ],
    migrations    : [ 'src/database/migrations/*.{ts,js}' ],
    synchronize   : false,
    namingStrategy: new SnakeNamingStrategy()
  }

export default new DataSource(dataSourceConfig)
