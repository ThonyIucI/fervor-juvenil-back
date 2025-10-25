# New Module Scaffolder

Create a new module following hexagonal architecture based on the User module template.

## Instructions

You will create a complete NestJS module with hexagonal architecture. Follow these steps:

1. **Ask for module details:**
   - Module name (e.g., "product", "order", "category")
   - Main entity fields and their types
   - Relationships with other entities (if any)

2. **Create the following structure:**

```
src/{module-name}/
├── domain/
│   ├── entities/
│   │   └── {entity}.entity.ts          # Pure domain entity
│   ├── value-objects/                   # Value objects if needed
│   ├── exceptions/
│   │   └── {entity}-not-found.exception.ts
│   └── repositories/
│       └── {entity}-repository.interface.ts
├── application/
│   ├── use-cases/
│   │   ├── create-{entity}.use-case.ts
│   │   ├── find-{entity}-by-id.use-case.ts
│   │   ├── find-all-{entities}.use-case.ts
│   │   ├── update-{entity}.use-case.ts
│   │   └── delete-{entity}.use-case.ts
│   └── dto/
│       ├── create-{entity}.dto.ts
│       └── update-{entity}.dto.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── {entity}.schema.ts          # TypeORM schema
│   │   └── typeorm-{entity}.repository.ts
│   └── mappers/
│       └── {entity}.mapper.ts
├── presentation/
│   ├── controllers/
│   │   ├── create-{entity}.controller.ts
│   │   ├── find-{entity}.controller.ts
│   │   ├── find-all-{entities}.controller.ts
│   │   ├── update-{entity}.controller.ts
│   │   └── delete-{entity}.controller.ts
│   └── dto/
│       └── {entity}-response.dto.ts
├── {module-name}.module.ts
└── README.md
```

3. **Follow these rules:**
   - Use UUID v7 for primary keys (generated from backend, not database)
   - All database column names in English with snake_case
   - TypeORM schemas use camelCase (converted by SnakeNamingStrategy)
   - One controller per endpoint (RESTful)
   - One use case per business operation
   - Pure domain entities without ORM decorators
   - Mappers to translate between domain and persistence

4. **Reference files:**
   - Use `src/user/` module as template
   - Check `context/db-structure.sql` for database conventions
   - Follow standards in `CLAUDE.md`

5. **After creating the module:**
   - Generate migration: `npm run typeorm -- migration:generate ./src/database/migrations/Add{Module} -d typeorm.config.ts`
   - Update `context/db-structure.sql` with new table schema
   - Create tests for use cases
   - Register module in `app.module.ts`

## Example Usage

User: `/new-module product`

Claude: I'll help you create a new Product module. Let me ask a few questions:
1. What fields should the Product entity have? (e.g., name, description, price, stock)
2. Does it have relationships with other entities? (e.g., belongs to Category, has many OrderItems)
3. Any special validations or business rules?

[Then proceed to create all files following the structure]
