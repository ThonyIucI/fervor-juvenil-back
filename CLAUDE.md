# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS backend application (fervor-juvenil-back) using TypeORM with PostgreSQL. The application uses JWT authentication and has custom Spanish validation messages throughout.

## Development Commands

### Running the application
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Building
```bash
npm run build
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Code quality
```bash
# Lint with auto-fix
npm run lint

# Format code
npm run format
```

### Database migrations (TypeORM)
```bash
# Generate a new migration (requires --name parameter)
npm run m:gen --name=MigrationName

# Run pending migrations in development
npm run m:run-dev

# Revert last migration in development
npm run m:revert-dev
```

Migration files are located in `src/database/migrations/`.

### Docker - Dos modos de desarrollo

#### Opción A: Todo en Docker (compose.yaml)
Backend y base de datos en contenedores. Útil para replicar entorno de producción.

```bash
# Iniciar todo (DB + backend)
docker compose up -d

# Reiniciar SOLO el backend (sin tocar la DB)
docker compose restart api

# Reiniciar SOLO la DB
docker compose restart db

# Ver logs del backend
docker compose logs -f api

# Detener todo
docker compose down
```

**Configuración en .env:**
```bash
DB_HOST=db          # Nombre del servicio en Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=rootpassword
DB_NAME=fervor_juvenil
```

**Para cambiar variables:** Edita `.env` y ejecuta `docker compose restart api`

#### Opción B: Solo DB en Docker (compose.local.yaml) - RECOMENDADO
Base de datos en Docker, backend en tu máquina. Mejor para desarrollo activo.

```bash
# Iniciar solo la DB
docker compose -f compose.local.yaml up -d

# En otra terminal, iniciar el backend localmente
npm run start:dev

# Detener la DB
docker compose -f compose.local.yaml down
```

**Configuración en .env:**
```bash
DB_HOST=localhost   # ← Diferencia importante
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=rootpassword
DB_NAME=fervor_juvenil
```

**Ventajas:**
- ✅ Hot reload instantáneo (sin reconstruir contenedores)
- ✅ Debugging más fácil en tu IDE
- ✅ Cambias `.env` y la app se reinicia automáticamente
- ✅ Logs directos en tu terminal

### Environment Configuration
La aplicación usa un único archivo `.env` para todos los entornos.

**Para conectarte a base de datos remota (Render, etc):**
```bash
# En .env, comenta las variables DB_* y descomenta DATABASE_URL:
# DB_HOST=localhost
# DB_PORT=5432
# ...
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

La app detecta `DATABASE_URL` automáticamente y lo prioriza sobre variables individuales.

The application runs on port 3006 by default (configured via `PORT` in `.env`).

## Deployment (Render)

### Diferencia entre desarrollo y producción

| | Desarrollo local | Producción (Render) |
|---|---|---|
| **Backend** | `npm run start:dev` (Node directo) | Docker container (usa `Dockerfile`) |
| **Base de datos** | Docker local (`compose.local.yaml`) | PostgreSQL de Render (managed) |
| **Variables** | `.env` local | Variables de entorno de Render |
| **Hot reload** | ✅ Sí | ❌ No |

### Configuración en Render

**El `Dockerfile` ya está configurado correctamente.** No necesitas cambios.

Render automáticamente:
1. Detecta el `Dockerfile`
2. Construye la imagen Docker
3. Ejecuta `node dist/src/main.js` (línea 37 del Dockerfile)
4. Inyecta `DATABASE_URL` si conectaste PostgreSQL

**Variables de entorno requeridas en Render:**

```bash
# 1. DATABASE_URL (automática al conectar PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# 2. JWT_SECRET (genera uno seguro)
JWT_SECRET=tu_secret_seguro_aqui

# 3. NODE_ENV
NODE_ENV=production

# 4. PORT (Render lo maneja automáticamente, NO lo configures manualmente)

# Opcionales (Google OAuth):
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=https://tu-app.onrender.com/api/auth/google-redirect
```

**Para generar un JWT_SECRET seguro:**
```bash
openssl rand -base64 32
```

### Proceso de deploy
1. Push tu código a GitHub
2. Render detecta cambios automáticamente
3. Construye la imagen Docker
4. Despliega el contenedor

**No hay diferencia en cómo despliegas.** Localmente usas `npm run start:dev` para desarrollo, pero Render siempre usa Docker.

## Architecture

### Hexagonal Architecture (Ports & Adapters)

Este proyecto implementa **arquitectura hexagonal** para garantizar separación de responsabilidades, testabilidad y escalabilidad.

#### Principios Fundamentales

1. **Single Responsibility**: Un controller = un método HTTP, un use case = una operación
2. **Dependency Inversion**: Las dependencias apuntan hacia el dominio
3. **Separation of Concerns**: Capas claramente definidas

#### Estructura de Módulos

Todos los módulos siguen esta estructura:

```
src/[module]/
├── domain/                          # Capa de Dominio (núcleo)
│   ├── entities/                    # Entidades puras (sin decoradores ORM)
│   ├── value-objects/               # Objetos de valor con validaciones
│   ├── exceptions/                  # Excepciones de dominio
│   └── repositories/                # Interfaces (puertos)
├── application/                     # Capa de Aplicación
│   ├── use-cases/                   # Casos de uso (1 clase = 1 operación)
│   └── dto/                         # DTOs de entrada
├── infrastructure/                  # Capa de Infraestructura
│   ├── persistence/                 # Schemas y repositorios TypeORM
│   └── mappers/                     # Mappers dominio ↔ persistencia
└── presentation/                    # Capa de Presentación
    ├── controllers/                 # Controllers (1 clase = 1 endpoint)
    └── dto/                         # DTOs de salida
```

#### Flujo de Datos

```
HTTP Request
    ↓
[Controller] → valida DTO
    ↓
[Use Case] → lógica de negocio
    ↓
[Repository Interface] ← puerto (dominio)
    ↓
[TypeORM Repository] → adaptador (infraestructura)
    ↓
[Mapper] → dominio ↔ persistencia
    ↓
[Domain Entity] → entidad pura
    ↓
HTTP Response
```

### User Module - Ejemplo de Referencia

El módulo de usuarios es el **estándar arquitectónico** para todos los módulos del proyecto.

**Componentes principales:**

- **Value Objects**: `Email`, `Password`, `UserName` - encapsulan validaciones
- **Domain Entity**: `User` - entidad pura sin decoradores de TypeORM
- **Repository Interface**: `IUserRepository` - puerto definido en dominio
- **Use Cases**: `CreateUserUseCase`, `FindUserByIdUseCase`, etc. - casos de uso independientes
- **Controllers**: `CreateUserController`, `FindUserController`, etc. - un endpoint por clase
- **Schema**: `UserSchema` - entidad TypeORM con decoradores
- **Mapper**: `UserMapper` - traduce entre dominio y persistencia

**Ver documentación completa:** [src/user/README.md](src/user/README.md)

### Database & ORM

- **TypeORM** with PostgreSQL (configured to use Postgres, MySQL support exists but is commented out)
- Uses `SnakeNamingStrategy` for column naming (camelCase in code → snake_case in DB)
- `synchronize: false` - migrations are required for schema changes
- Configuration in both `typeorm.config.ts` (CLI) and `src/app.module.ts` (runtime)
- Names always in english (for consistency) and in `snake_case`
- **Schemas TypeORM separados de entidades de dominio** - se usan Mappers para traducir

### Global Configuration

- **Environment**: Uses `@nestjs/config` with `.env` file
- **Validation**: Custom `SpanishValidationPipe` applied globally in [src/main.ts](src/main.ts)
  - Transforms input data
  - Uses Spanish error messages via custom validators in [src/common/validators/spanish-validators.ts](src/common/validators/spanish-validators.ts)
  - Translates standard class-validator messages to Spanish
- **Exception handling**: `HttpExceptionFilter` applied globally
- **API prefix**: All routes prefixed with `/api`
- **CORS**: Enabled with custom exposed headers

### Authentication

- JWT-based authentication via `@nestjs/jwt` and `passport-jwt`
- JWT secret and expiration configured in [src/auth/auth.module.ts](src/auth/auth.module.ts) (1 day expiry)
- Google OAuth support (partially implemented with `passport-google-oauth20`)
- Protected routes use `JwtAuthGuard` with JWT strategy in [src/auth/strategies/jwt.strategy.ts](src/auth/strategies/jwt.strategy.ts)
- **Integración con User Module**: AuthService usa casos de uso (`ValidateCredentialsUseCase`, `CreateUserUseCase`)

### Spanish Validation

Custom validation decorators are defined for Spanish error messages:
- `isNotEmptySpanish()` - required field validation
- `IsEmailSpanish()` - email format validation
- `MinLengthSpanish()` - minimum length validation

Use these decorators in DTOs instead of standard class-validator decorators to maintain consistent Spanish messaging.

### Project Structure

```
src/
├── auth/              # Authentication module (JWT, guards, strategies)
├── user/              # User module - ARQUITECTURA DE REFERENCIA
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
├── common/            # Shared utilities
│   ├── filters/       # Exception filters
│   ├── pipes/         # Custom validation pipes
│   ├── validators/    # Custom validators
│   └── utils/         # Utility functions
└── database/
    └── migrations/    # TypeORM migrations
```

### Guía para Nuevos Módulos

Al crear un nuevo módulo, **sigue la estructura del módulo User**:

1. Crear estructura de carpetas: `domain/`, `application/`, `infrastructure/`, `presentation/`
2. Definir entidades de dominio con Value Objects
3. Crear excepciones de dominio
4. Definir interfaz de repositorio en `domain/repositories/`
5. Implementar casos de uso en `application/use-cases/`
6. Crear schema TypeORM en `infrastructure/persistence/`
7. Implementar mapper y repositorio
8. Crear controllers específicos (uno por endpoint)
9. Configurar providers en el módulo

**Consulta [src/user/README.md](src/user/README.md) para ejemplos detallados.**

## Pull Request Template

When creating PRs, use the template in `.github/pull_request_template.md`:
- **Motivo**: Link to Jira ticket
- **Descripción**: Description of changes
- **Pruebas**: Test plan or evidence
