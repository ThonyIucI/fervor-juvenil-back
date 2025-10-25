# Implement Tests (TDD - RED Phase)

**Modelo recomendado:** Sonnet/Opus (requiere análisis de requisitos)

## Descripción

Implementa tests VACÍOS basados en criterios de aceptación. Los tests deben FALLAR inicialmente (RED phase del TDD).

## Instrucciones

### Paso 1: Analizar Criterios de Aceptación

1. Leer ticket de Linear (desde `.linear/FER-X.json`)
2. Extraer todos los criterios de aceptación
3. Identificar qué se debe testear:
   - Unit tests (use cases, value objects)
   - Integration tests (repositories, database)
   - E2E tests (endpoints completos)

### Paso 2: Identificar Módulos Afectados

Basándose en la user story, determinar:

- ¿Qué módulos se crean/modifican?
- ¿Qué use cases se necesitan?
- ¿Qué endpoints HTTP se exponen?
- ¿Qué cambios en la DB?

Ejemplo:
```
User Story: "Implement product CRUD"

Módulos:
- src/product/ (nuevo)

Use Cases:
- CreateProductUseCase
- FindProductByIdUseCase
- UpdateProductUseCase
- DeleteProductUseCase

Endpoints:
- POST /api/products
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id

Database:
- Nueva tabla: products
```

### Paso 3: Crear Unit Tests (Vacíos)

Para cada use case, crear `{use-case}.spec.ts`:

```typescript
import { CreateProductUseCase } from './create-product.use-case'
import { IProductRepository } from '../../domain/repositories/product-repository.interface'

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase
  let repository: jest.Mocked<IProductRepository>

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByName: jest.fn(),
    } as any

    useCase = new CreateProductUseCase(repository)
  })

  describe('execute', () => {
    it('should create product when valid data is provided', async () => {
      // TODO: Implement test
      expect(true).toBe(false) // Forzar fallo
    })

    it('should throw error when product name already exists', async () => {
      // TODO: Implement test
      expect(true).toBe(false) // Forzar fallo
    })

    it('should validate required fields', async () => {
      // TODO: Implement test
      expect(true).toBe(false) // Forzar fallo
    })
  })
})
```

### Paso 4: Crear Integration Tests (Vacíos)

Para el repositorio:

```typescript
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmProductRepository } from './typeorm-product.repository'
import { ProductSchema } from './product.schema'

describe('TypeOrmProductRepository (Integration)', () => {
  let repository: TypeOrmProductRepository

  beforeAll(async () => {
    // TODO: Setup in-memory database
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ProductSchema],
          synchronize: true
        }),
        TypeOrmModule.forFeature([ProductSchema])
      ],
      providers: [TypeOrmProductRepository]
    }).compile()

    repository = module.get(TypeOrmProductRepository)
  })

  describe('save', () => {
    it('should save product to database', async () => {
      // TODO: Implement test
      expect(true).toBe(false)
    })
  })

  describe('findById', () => {
    it('should find product by id', async () => {
      // TODO: Implement test
      expect(true).toBe(false)
    })
  })
})
```

### Paso 5: Crear E2E Tests (Vacíos)

Para endpoints:

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('ProductController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/products', () => {
    it('should create a new product', () => {
      // TODO: Implement test
      return request(app.getHttpServer())
        .post('/api/products')
        .send({ name: 'Test Product', price: 100 })
        .expect(201)
        .then(() => {
          expect(true).toBe(false) // Forzar fallo por ahora
        })
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return product by id', () => {
      // TODO: Implement test
      expect(true).toBe(false)
    })
  })
})
```

### Paso 6: Mapear Tests a Criterios de Aceptación

Crear archivo `.linear/FER-X-tests.md`:

```markdown
# Tests for FER-13: UUID Migrations

## Acceptance Criteria Mapping

### ✓ Criterio 1: Generate migrations without errors
**Tests:**
- [ ] test/unit/migrations/generate-migration.spec.ts::should generate migration successfully
- [ ] test/integration/typeorm/migration-execution.spec.ts::should execute migration

### ✓ Criterio 2: All tables use UUID as primary key
**Tests:**
- [ ] test/integration/database/schema-validation.spec.ts::should have uuid primary keys
- [ ] test/unit/schemas/user-schema.spec.ts::should use @PrimaryColumn('uuid')

[... más criterios]

## Test Summary
- Unit Tests: 8 created (0 passing, 8 failing)
- Integration Tests: 4 created (0 passing, 4 failing)
- E2E Tests: 3 created (0 passing, 3 failing)
- **Total: 15 tests - ALL FAILING (RED phase) ✓**
```

### Paso 7: Ejecutar Tests (Deben FALLAR)

```bash
npm run test

# Output esperado:
# FAIL  test/unit/create-product.use-case.spec.ts
# FAIL  test/integration/typeorm-product.repository.spec.ts
# FAIL  test/e2e/product.e2e-spec.ts
#
# Tests:       15 failed, 0 passed, 15 total
# RED PHASE CONFIRMED ✓
```

### Paso 8: Output

```markdown
✅ Tests Implementation Complete (RED Phase)

📊 Test Summary:
- Unit Tests: 8 files created (8 failing)
- Integration Tests: 4 files created (4 failing)
- E2E Tests: 3 files created (3 failing)
- **Total: 15 failing tests ✓**

📋 Acceptance Criteria Coverage:
- Criterio 1: 3 tests
- Criterio 2: 4 tests
- Criterio 3: 5 tests
- Criterio 4: 3 tests

🎯 RED Phase Confirmed!
All tests are failing as expected.

📁 Files Created:
- test/unit/product/create-product.use-case.spec.ts
- test/unit/product/find-product.use-case.spec.ts
- test/integration/product/typeorm-product.repository.spec.ts
- test/e2e/product.e2e-spec.ts

🔥 Next Step:
Run: /implement-logic
This will implement the code to make tests pass (GREEN phase)
```

## Convenciones de Tests

### Naming

```typescript
// ✅ BIEN
describe('CreateProductUseCase', () => {
  describe('execute', () => {
    it('should create product when valid data is provided', async () => {})
    it('should throw ProductAlreadyExistsException when name is duplicate', async () => {})
  })
})

// ❌ MAL
describe('Product tests', () => {
  it('test1', () => {})
})
```

### Estructura AAA (Arrange-Act-Assert)

```typescript
it('should create product when valid data is provided', async () => {
  // Arrange (Setup)
  const dto = { name: 'Product', price: 100 }
  repository.findByName.mockResolvedValue(null)
  repository.save.mockResolvedValue(mockProduct)

  // Act (Execute)
  const result = await useCase.execute(dto)

  // Assert (Verify)
  expect(result).toEqual(mockProduct)
  expect(repository.save).toHaveBeenCalled()
})
```

## In-Memory Database para Integration Tests

Usar SQLite en memoria:

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  entities: [ProductSchema, UserSchema],
  synchronize: true, // Solo para tests
  dropSchema: true,  // Limpiar entre tests
  logging: false
})
```

## Validaciones

- ✅ Todos los tests creados están vacíos (con TODO)
- ✅ Todos los tests fallan (RED phase)
- ✅ Cada criterio de aceptación tiene al menos 1 test
- ✅ Tests siguen convenciones de nombrado
- ✅ In-memory database configurada para integration tests

## Ejemplo Completo

```
👤 Usuario:
/implement-tests FER-13

🤖 Claude (Sonnet):
Reading ticket FER-13...
✅ Found 4 acceptance criteria

Analyzing required modules...
✅ Identified: migrations, schemas, repositories

Creating unit tests...
✅ 8 unit test files created

Creating integration tests...
✅ 4 integration test files created

Creating e2e tests...
✅ 3 e2e test files created

Running tests to confirm RED phase...
❌ 15 tests failing (expected)

✅ RED Phase Complete!

Next: /implement-logic to make tests pass
```
