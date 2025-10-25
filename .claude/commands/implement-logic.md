# Implement Logic (TDD - GREEN Phase)

**Modelo recomendado:** Opus (lógica compleja, arquitectura hexagonal)

## Descripción

Implementa el código mínimo necesario para que todos los tests pasen (GREEN phase del TDD).

## Instrucciones

### Paso 1: Verificar Estado de Tests

```bash
# Confirmar que estamos en RED phase
npm run test

# Debe mostrar tests fallando
# Si no hay tests fallando, abortar y sugerir /implement-tests primero
```

### Paso 2: Analizar Tests Fallando

1. Leer todos los archivos de test creados
2. Entender qué se espera de cada test
3. Identificar qué código crear en orden:
   - Domain entities
   - Value objects
   - Repository interfaces
   - Use cases
   - TypeORM schemas
   - Mappers
   - Controllers
   - Module configuration

### Paso 3: Implementar Siguiendo Arquitectura Hexagonal

**Orden recomendado:**

#### 3.1 Domain Layer (Núcleo)

```typescript
// 1. Value Objects
export class ProductName {
  private constructor(private readonly value: string) {
    this.validate()
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new InvalidProductNameException()
    }
    if (this.value.length > 100) {
      throw new ProductNameTooLongException()
    }
  }

  static create(value: string): ProductName {
    return new ProductName(value)
  }

  getValue(): string {
    return this.value
  }
}

// 2. Domain Entity
export class Product {
  constructor(
    private uuid: string,
    private name: ProductName,
    private price: number,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  // Métodos de negocio
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new InvalidPriceException()
    }
    this.price = newPrice
    this.updatedAt = new Date()
  }

  // Getters
  getUuid(): string { return this.uuid }
  getName(): string { return this.name.getValue() }
  getPrice(): number { return this.price }
}

// 3. Domain Exceptions
export class ProductNotFoundException extends Error {
  constructor(uuid: string) {
    super(`Product with uuid ${uuid} not found`)
    this.name = 'ProductNotFoundException'
  }
}

// 4. Repository Interface (Puerto)
export interface IProductRepository {
  save(product: Product): Promise<Product>
  findById(uuid: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  update(product: Product): Promise<Product>
  delete(uuid: string): Promise<void>
}
```

#### 3.2 Application Layer

```typescript
// Use Case
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    // Validar reglas de negocio
    const existingProduct = await this.repository.findByName(dto.name)
    if (existingProduct) {
      throw new ProductAlreadyExistsException(dto.name)
    }

    // Crear entidad de dominio
    const uuid = uuidv7() // UUID v7 generado desde backend
    const name = ProductName.create(dto.name)

    const product = new Product(
      uuid,
      name,
      dto.price,
      new Date(),
      new Date()
    )

    // Persistir
    return await this.repository.save(product)
  }
}
```

#### 3.3 Infrastructure Layer

```typescript
// TypeORM Schema
@Entity({ name: 'products' })
export class ProductSchema {
  @PrimaryColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

// Mapper
export class ProductMapper {
  static toDomain(schema: ProductSchema): Product {
    return new Product(
      schema.uuid,
      ProductName.create(schema.name),
      Number(schema.price),
      schema.createdAt,
      schema.updatedAt
    )
  }

  static toPersistence(domain: Product): ProductSchema {
    const schema = new ProductSchema()
    schema.uuid = domain.getUuid()
    schema.name = domain.getName()
    schema.price = domain.getPrice()
    schema.createdAt = domain.getCreatedAt()
    schema.updatedAt = domain.getUpdatedAt()
    return schema
  }
}

// Repository Implementation (Adaptador)
@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<ProductSchema>
  ) {}

  async save(product: Product): Promise<Product> {
    const schema = ProductMapper.toPersistence(product)
    const saved = await this.repository.save(schema)
    return ProductMapper.toDomain(saved)
  }

  async findById(uuid: string): Promise<Product | null> {
    const schema = await this.repository.findOne({ where: { uuid } })
    return schema ? ProductMapper.toDomain(schema) : null
  }

  // ... otros métodos
}
```

#### 3.4 Presentation Layer

```typescript
// Controller
@Controller('products')
@ApiTags('products')
export class CreateProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  async create(
    @Body() dto: CreateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(dto)
    return ProductResponseDto.fromDomain(product)
  }
}
```

### Paso 4: Ejecutar Tests Iterativamente

Después de implementar cada capa:

```bash
# Ejecutar tests
npm run test

# Verificar cuántos pasan ahora
# Continuar implementando hasta que TODOS pasen
```

**Flujo iterativo:**

1. Implementar domain entities → Ejecutar tests → Ver qué falla
2. Implementar use cases → Ejecutar tests → Ver qué falla
3. Implementar repositories → Ejecutar tests → Ver qué falla
4. Implementar controllers → Ejecutar tests → Ver qué falla
5. Configurar módulo → Ejecutar tests → TODOS PASAN ✓

### Paso 5: Generar Migración (Si aplica)

Si el feature requiere cambios en DB:

```bash
# Generar migración
npm run typeorm -- migration:generate ./src/database/migrations/AddProducts -d typeorm.config.ts

# Revisar migración generada
# Ejecutar migración en entorno de desarrollo
npm run m:run-dev

# Actualizar context/db-structure.sql
# (o ejecutar /update-db-context)
```

### Paso 6: Validar Arquitectura

Verificar que se siguió la arquitectura hexagonal:

```
✅ Domain entities sin dependencias externas
✅ Repository interfaces definidas en domain/
✅ TypeORM schemas solo en infrastructure/
✅ Mappers para traducir domain ↔ persistence
✅ Controllers delgados (delegan a use cases)
✅ Use cases con una sola responsabilidad
```

### Paso 7: Ejecutar Todos los Tests

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests e2e
npm run test:e2e

# Verificar coverage
npm run test:cov
```

### Paso 8: Output

```markdown
✅ Logic Implementation Complete (GREEN Phase)

📊 Test Results:
- Unit Tests: 8/8 passing ✓
- Integration Tests: 4/4 passing ✓
- E2E Tests: 3/3 passing ✓
- **Total: 15/15 passing ✓**

📁 Files Created:
Domain Layer:
- src/product/domain/entities/product.entity.ts
- src/product/domain/value-objects/product-name.vo.ts
- src/product/domain/exceptions/product-not-found.exception.ts
- src/product/domain/repositories/product-repository.interface.ts

Application Layer:
- src/product/application/use-cases/create-product.use-case.ts
- src/product/application/use-cases/find-product-by-id.use-case.ts
- src/product/application/dto/create-product.dto.ts

Infrastructure Layer:
- src/product/infrastructure/persistence/product.schema.ts
- src/product/infrastructure/persistence/typeorm-product.repository.ts
- src/product/infrastructure/mappers/product.mapper.ts

Presentation Layer:
- src/product/presentation/controllers/create-product.controller.ts
- src/product/presentation/dto/product-response.dto.ts

Module:
- src/product/product.module.ts

Database:
- src/database/migrations/1234567890-AddProducts.ts
- context/db-structure.sql (updated)

🎯 GREEN Phase Complete!
All tests are passing.

📈 Code Coverage:
- Statements: 87%
- Branches: 82%
- Functions: 85%
- Lines: 88%

🔥 Next Steps:
1. Review code for refactoring opportunities: /refactor (optional)
2. Commit changes: /commit-changes
3. Create PR: /review-pr
```

## Principios a Seguir

### 1. YAGNI (You Aren't Gonna Need It)

Implementar solo lo necesario para pasar los tests:

```typescript
// ❌ MAL - Código innecesario
class Product {
  // ... 50 métodos que no se usan en los tests
}

// ✅ BIEN - Solo lo necesario
class Product {
  updatePrice(newPrice: number): void {
    // Solo este método es necesario ahora
  }
}
```

### 2. Keep It Simple

```typescript
// ❌ MAL - Sobre-engineering
class ProductPriceCalculationStrategyFactory {
  createStrategy(type: string): IPriceCalculationStrategy {
    // Complejidad innecesaria
  }
}

// ✅ BIEN - Simple y directo
updatePrice(newPrice: number): void {
  if (newPrice < 0) throw new InvalidPriceException()
  this.price = newPrice
}
```

### 3. Test-Driven

Solo implementar código que hace pasar un test:

```
1. Test falla (RED)
2. Escribir código mínimo
3. Test pasa (GREEN)
4. Siguiente test
```

## In-Memory Database

Para tests de integración, usar SQLite:

```typescript
// test/setup/database.ts
export const createTestDatabase = () => ({
  type: 'sqlite' as const,
  database: ':memory:',
  entities: [ProductSchema, UserSchema],
  synchronize: true,
  dropSchema: true,
  logging: false
})
```

## Validaciones

- ✅ TODOS los tests pasan (15/15)
- ✅ Coverage >80%
- ✅ Arquitectura hexagonal seguida
- ✅ Sin decoradores ORM en domain entities
- ✅ Mappers implementados
- ✅ Migraciones generadas y ejecutadas (si aplica)

## Ejemplo Completo

```
👤 Usuario:
/implement-logic

🤖 Claude (Opus):
Analyzing failing tests...
✅ Found 15 failing tests

Planning implementation...
✅ Modules identified: product, migrations

Implementing Domain Layer...
✅ Product entity created
✅ ProductName value object created
✅ Repository interface created

Running tests... (3/15 passing)

Implementing Application Layer...
✅ CreateProductUseCase created
✅ FindProductUseCase created

Running tests... (8/15 passing)

Implementing Infrastructure Layer...
✅ ProductSchema created
✅ TypeOrmProductRepository created
✅ ProductMapper created

Running tests... (12/15 passing)

Implementing Presentation Layer...
✅ Controllers created
✅ DTOs created

Running tests... (14/15 passing)

Configuring Module...
✅ ProductModule configured

Running final tests...
✅ 15/15 tests passing!

Generating migration...
✅ Migration created: AddProducts.ts

Updating DB context...
✅ context/db-structure.sql updated

✅ GREEN Phase Complete!

Next: /commit-changes
```
