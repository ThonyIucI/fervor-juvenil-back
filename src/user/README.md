# User Module - Arquitectura Hexagonal

Este módulo implementa una **arquitectura hexagonal** limpia y escalable para la gestión de usuarios.

## Estructura del Módulo

```
src/user/
├── domain/                          # Capa de Dominio (núcleo del negocio)
│   ├── entities/
│   │   └── user.entity.ts          # Entidad de dominio pura (sin decoradores ORM)
│   ├── value-objects/
│   │   ├── email.vo.ts             # Validación y encapsulación de email
│   │   ├── password.vo.ts          # Manejo seguro de contraseñas
│   │   └── user-name.vo.ts         # Encapsulación de nombre completo
│   ├── exceptions/
│   │   ├── user-not-found.exception.ts
│   │   ├── user-already-exists.exception.ts
│   │   └── invalid-credentials.exception.ts
│   └── repositories/
│       └── user.repository.interface.ts  # Interfaz (puerto)
│
├── application/                     # Capa de Aplicación (casos de uso)
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── find-user-by-id.use-case.ts
│   │   ├── find-user-by-email.use-case.ts
│   │   ├── find-all-users.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   ├── delete-user.use-case.ts
│   │   └── validate-credentials.use-case.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── infrastructure/                  # Capa de Infraestructura (adaptadores)
│   ├── persistence/
│   │   ├── user.schema.ts          # Schema TypeORM (decoradores)
│   │   └── typeorm-user.repository.ts  # Implementación del repositorio
│   └── mappers/
│       └── user.mapper.ts          # Mapper dominio ↔ persistencia
│
├── presentation/                    # Capa de Presentación (API)
│   ├── controllers/
│   │   ├── create-user.controller.ts    # POST /users
│   │   ├── find-user.controller.ts      # GET /users, GET /users/:id
│   │   ├── update-user.controller.ts    # PATCH /users/:id
│   │   └── delete-user.controller.ts    # DELETE /users/:id
│   └── dto/
│       └── user-response.dto.ts
│
└── user.module.ts                   # Configuración del módulo
```

## Principios Aplicados

### 1. Single Responsibility Principle (SRP)
- **Un controller = un método HTTP**
- **Un use case = una operación de negocio**
- Cada clase tiene una única responsabilidad

### 2. Dependency Inversion Principle (DIP)
- La capa de dominio define interfaces (puertos)
- La infraestructura implementa esas interfaces (adaptadores)
- Las dependencias apuntan hacia el dominio, no hacia afuera

### 3. Separation of Concerns
- **Dominio**: Lógica de negocio pura, sin dependencias externas
- **Aplicación**: Orquestación de casos de uso
- **Infraestructura**: Detalles técnicos (DB, APIs externas)
- **Presentación**: Interfaz HTTP

## Flujo de Datos

```
HTTP Request
    ↓
[Controller] → valida DTO de entrada
    ↓
[Use Case] → orquesta la lógica de negocio
    ↓
[Repository Interface] ← definida en dominio
    ↓
[TypeORM Repository] → implementa la interfaz
    ↓
[User Schema] → entidad de TypeORM
    ↓
[Mapper] → convierte entre domain entity y schema
    ↓
[User Entity] → entidad de dominio
    ↓
[Controller] → convierte a DTO de respuesta
    ↓
HTTP Response
```

## Componentes Clave

### Value Objects
Encapsulan validaciones y comportamiento de valores primitivos:

- **Email**: Valida formato y normaliza a minúsculas
- **Password**: Hasheo seguro con bcrypt
- **UserName**: Maneja nombre completo y generación de slug

### Use Cases
Cada caso de uso es independiente y reutilizable:

```typescript
// Ejemplo: CreateUserUseCase
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Validar que el email no exista
    // 2. Crear entidad de dominio
    // 3. Persistir mediante repositorio
    // 4. Retornar usuario creado
  }
}
```

### Repository Pattern
La interfaz está en el dominio, la implementación en infraestructura:

```typescript
// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  save(user: User): Promise<User>
  findByUuid(uuid: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  delete(uuid: string): Promise<void>
}
```

### Mappers
Traducen entre entidades de dominio y schemas de persistencia:

```typescript
export class UserMapper {
  static toDomain(schema: UserSchema): User {
    return User.reconstruct(...)
  }

  static toPersistence(domain: User): UserSchema {
    // ...
  }
}
```

## Integración con Auth Module

El módulo de autenticación importa `UserModule` y usa los casos de uso:

```typescript
// auth.module.ts
@Module({
  imports: [UserModule],
  // ...
})

// auth.service.ts
constructor(
  private readonly validateCredentialsUseCase: ValidateCredentialsUseCase,
  private readonly createUserUseCase: CreateUserUseCase
) {}
```

## Ventajas de esta Arquitectura

1. **Testeable**: Cada capa se puede testear independientemente
2. **Mantenible**: Cambios en una capa no afectan a otras
3. **Escalable**: Fácil agregar nuevos casos de uso o adaptadores
4. **Reutilizable**: Los casos de uso pueden ser usados por diferentes módulos
5. **Limpia**: Separación clara de responsabilidades
6. **Profesional**: Sigue mejores prácticas de arquitectura de software

## Cómo Agregar un Nuevo Caso de Uso

1. Crear el use case en `application/use-cases/`
2. Inyectar el repositorio mediante la interfaz
3. Implementar la lógica de negocio
4. Registrar el provider en `user.module.ts`
5. Exportarlo si otros módulos lo necesitan
6. Crear un controller específico si se expone como endpoint

## Ejemplo de Uso

```typescript
// En cualquier servicio que importe UserModule
constructor(
  private readonly findUserByIdUseCase: FindUserByIdUseCase
) {}

async someMethod(userId: string) {
  const user = await this.findUserByIdUseCase.execute(userId)
  // user es una entidad de dominio con todos sus métodos
  console.log(user.getFullName())
  console.log(user.getEmail())
}
```
