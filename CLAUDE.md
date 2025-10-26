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
4. **Domain-Driven Logic**: TODA la lógica de negocio está en el dominio, NO en servicios
5. **Factory Methods**: NUNCA usar `repository.create()` directamente, siempre usar métodos `make()` de entidades
6. **Value Objects for Constants**: Usar enums y constantes en Value Objects para evitar valores mágicos repetidos

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

### Clean Architecture Rules - CRITICAL

**ESTAS REGLAS SON OBLIGATORIAS Y DEBEN SEGUIRSE SIEMPRE:**

#### 1. Lógica de Negocio SOLO en Dominio

❌ **MAL - Lógica en Servicio:**
```typescript
// service.ts
async createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10) // ❌ Lógica de hash en servicio
  const user = this.repository.create({...}) // ❌ Crear directamente
  return await this.repository.save(user)
}
```

✅ **BIEN - Lógica en Entidad:**
```typescript
// user.entity.ts
static async create(firstName, lastName, email, plainPassword) {
  const passwordVO = Password.create(plainPassword)
  const hashedPasswordVO = await passwordVO.hash() // ✅ Hash en Value Object
  return new User(...) // ✅ Validaciones en constructor
}

// service.ts
async createUser(data) {
  const user = await User.create(...) // ✅ Usa factory method de dominio
  const userPrimitives = user.toPrimitives()
  const userSchema = this.repository.create(userPrimitives)
  return await this.repository.save(userSchema)
}
```

#### 2. Factory Methods Obligatorios

❌ **MAL - Uso Directo de create():**
```typescript
const user = this.repository.create({
  uuid: uuidv7(),
  email: email.toLowerCase(), // ❌ Validación en servicio
  password: await bcrypt.hash(password, 10), // ❌ Hash en servicio
  ...
})
```

✅ **BIEN - Factory Method:**
```typescript
// Entidad con factory method
static make(data: UserData): User {
  // Validaciones
  if (!data.email) throw new UserBadFieldException('email', 'Email requerido')

  return new User(uuidv7(), data.email.toLowerCase(), ...)
}

// Servicio usa factory
const user = User.make(data)
const userPrimitives = user.toPrimitives()
const userSchema = this.repository.create(userPrimitives)
```

#### 3. Excepciones Específicas por Módulo

Cada módulo debe tener su propia excepción `BadFieldException`:

```typescript
// common/exceptions/custom-error.ts
export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

// user/domain/exceptions/user-bad-field.exception.ts
export class UserBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de usuario inválido: ${field}. ${reason}`)
  }
}

// user-profile/domain/exceptions/user-profile-bad-field.exception.ts
export class UserProfileBadFieldException extends CustomError {
  constructor(field: string, reason: string) {
    super(`Campo de perfil inválido: ${field}. ${reason}`)
  }
}
```

#### 4. Value Objects para Constantes

❌ **MAL - Valores Repetidos:**
```typescript
// En varios archivos...
const allowedRoles = ['superadmin', 'admin', 'user'] // ❌ Repetido
if (role === 'superadmin') { ... } // ❌ String mágico
```

✅ **BIEN - Enum + Value Object:**
```typescript
// role/domain/value-objects/role-name.vo.ts
export enum RoleName {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user'
}

export class RoleNameVO {
  private constructor(private readonly value: RoleName) {}

  static create(name: string): RoleNameVO {
    if (!Object.values(RoleName).includes(name as RoleName)) {
      const allowed = Object.values(RoleName).join(', ')
      throw new RoleBadFieldException('name', `Rol inválido. Permitidos: ${allowed}`)
    }
    return new RoleNameVO(name as RoleName)
  }

  getValue(): string { return this.value }
  isSuperadmin(): boolean { return this.value === RoleName.SUPERADMIN }
}

// Uso
const userRole = await this.roleRepository.findOne({
  where: { name: RoleName.USER } // ✅ Usa enum, no string
})
```

#### 5. Métodos de Entidad

Toda entidad DEBE tener:

1. **Constructor privado**: Para forzar uso de factory methods
2. **Factory method `make()`**: Para crear nuevas instancias con validaciones
3. **Factory method `reconstruct()`**: Para reconstruir desde DB (sin validaciones)
4. **Método `toPrimitives()`**: Para convertir a objeto plano para persistencia
5. **Getters**: Para acceder a propiedades privadas
6. **Métodos de negocio**: update(), validate(), etc.

```typescript
export class User {
  private uuid: string
  private email: Email
  private password: Password

  private constructor(...) { } // ✅ Privado

  static async make(data: UserData): Promise<User> { // ✅ Factory
    // Validaciones aquí
    return new User(...)
  }

  static reconstruct(...): User { // ✅ Reconstruct
    return new User(...)
  }

  toPrimitives() { // ✅ Serialización
    return {
      uuid: this.uuid,
      email: this.email.getValue(),
      ...
    }
  }

  getEmail(): string { return this.email.getValue() } // ✅ Getter

  async updatePassword(newPassword: string) { // ✅ Lógica de negocio
    this.password = await Password.create(newPassword).hash()
  }
}
```

#### 6. Servicios SOLO para Orquestación

Los servicios (application layer) SOLO deben:
- ✅ Orquestar llamadas entre entidades y repositorios
- ✅ Manejar transacciones
- ✅ Coordinar múltiples operaciones
- ❌ NO deben tener lógica de validación
- ❌ NO deben tener lógica de transformación de datos
- ❌ NO deben hacer hashing, slugs, o cualquier lógica de dominio

#### 7. Validación en Capas

```
┌─────────────────────────────────┐
│ Presentation (DTOs)             │ ← Validación de formato (class-validator)
├─────────────────────────────────┤
│ Application (Use Cases)         │ ← Orquestación, NO validación
├─────────────────────────────────┤
│ Domain (Entities & VOs)         │ ← Validación de reglas de negocio ✅
├─────────────────────────────────┤
│ Infrastructure (Repositories)   │ ← Persistencia, NO validación
└─────────────────────────────────┘
```

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

## Database Schema Standards

### UUID Management
- **ALWAYS use UUID version 7** for all primary keys
- Configure TypeORM schemas with `@PrimaryColumn('uuid')` instead of `@PrimaryGeneratedColumn('uuid')`
- UUIDs must be generated from the backend application (not database auto-generation)
- DO NOT use `uuid_generate_v4()` or any database-level UUID generation
- **Reference**: See [context/db-structure.sql](context/db-structure.sql) for complete database schema

### Naming Conventions
- **ALL database column names MUST be in English**
- Use camelCase in TypeORM schemas (automatically converted to snake_case by SnakeNamingStrategy)
- Never use Spanish names in database schemas or migrations
- Table names: plural, snake_case (e.g., `user_profiles`, `user_roles`)

### Migration Guidelines
- Test migrations before committing
- Handle existing data appropriately (use `ALTER COLUMN` instead of `DROP/ADD` when possible)
- Always provide `down` migration for rollback capability
- Review generated migrations and fix any issues before running
- Keep [context/db-structure.sql](context/db-structure.sql) updated with schema changes

## Coding Standards & Best Practices

### TypeScript Standards
- Use strict TypeScript mode
- Prefer `const` over `let`, avoid `var`
- Use explicit return types for functions
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` type - use `unknown` if type is truly unknown

### NestJS Conventions
- One responsibility per class (Single Responsibility Principle)
- Use dependency injection for all services
- Controllers should be thin - delegate logic to use cases
- Use DTOs for all request/response bodies
- Apply validation pipes to all endpoints

### Testing Standards
- Write unit tests for all use cases
- Write integration tests for repositories
- Write e2e tests for critical flows
- Aim for >80% code coverage
- Test files: `*.spec.ts` for unit tests, `*.e2e-spec.ts` for e2e tests
- Use descriptive test names: `should return user when valid id is provided`

### File Naming Conventions
- **Kebab-case** for file names: `create-user.use-case.ts`
- **PascalCase** for class names: `CreateUserUseCase`
- **camelCase** for variables and functions: `createUser()`
- Test files: Same name as source + `.spec.ts`: `create-user.use-case.spec.ts`

### Import Organization
1. External libraries (React, NestJS, etc.)
2. Internal absolute imports (from src/)
3. Relative imports (../, ./)
4. Blank line between groups

Example:
```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { IUserRepository } from '../../domain/repositories/user-repository.interface'
import { User } from '../../domain/entities/user.entity'

import { UserSchema } from './user.schema'
import { UserMapper } from '../mappers/user.mapper'
```

### Error Handling
- Use domain-specific exceptions (e.g., `UserNotFoundException`)
- Create custom exceptions in `domain/exceptions/`
- Never expose internal errors to clients
- Log errors appropriately with context

### Comments and Documentation
- Write JSDoc comments for public methods and classes
- Explain WHY, not WHAT (code should be self-documenting for WHAT)
- Keep comments updated when code changes
- Use TODO comments for temporary solutions: `// TODO: Refactor this when...`

## Source of Truth Files

These files serve as the single source of truth for different aspects of the project:

1. **[context/db-structure.sql](context/db-structure.sql)** - Complete database schema
   - Update whenever migrations are created
   - Reference this when implementing repositories or queries

2. **[src/user/README.md](src/user/README.md)** - Architecture reference
   - Example of correct hexagonal architecture implementation
   - Use as template for new modules

3. **[CLAUDE.md](CLAUDE.md)** - This file
   - Project conventions and standards
   - Development workflows
   - Architectural decisions

## Working with Claude Agents

### Available Agents
Agents are defined in `.claude/agents/` directory. Use them for specialized tasks:

- `/test-reviewer` - Reviews test coverage and quality
- `/architecture-mentor` - Validates hexagonal architecture compliance
- `/code-reviewer` - Reviews code for standards and best practices
- `/migration-helper` - Assists with database migrations

### Available Slash Commands
Custom commands defined in `.claude/commands/`:

- `/new-module <name>` - Scaffolds a new module with hexagonal architecture
- `/review-pr` - Prepares code for PR review
- `/update-db-context` - Updates context/db-structure.sql from migrations

## Pull Request Template

When creating PRs, use the template in `.github/pull_request_template.md`:
- **Motivo**: Link to Jira ticket
- **Descripción**: Description of changes
- **Pruebas**: Test plan or evidence
