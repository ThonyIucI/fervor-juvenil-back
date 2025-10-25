# 🚀 TDD Workflow - Guía Completa

Flujo de trabajo Test-Driven Development (TDD) optimizado para este proyecto.

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Comando Principal](#comando-principal)
3. [Flujo Completo Paso a Paso](#flujo-completo-paso-a-paso)
4. [Sub-Comandos Disponibles](#sub-comandos-disponibles)
5. [Optimización de Recursos](#optimización-de-recursos)
6. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Introducción

Este proyecto sigue **Test-Driven Development (TDD)** para garantizar calidad y cobertura de código.

### Fases del TDD

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

1. **RED**: Escribir tests que fallan
2. **GREEN**: Implementar código mínimo para pasar los tests
3. **REFACTOR**: Mejorar el código manteniendo los tests verdes

---

## Comando Principal

### `/tdd-feature`

Comando orquestador que ejecuta el flujo completo desde ticket hasta commit.

**Uso:**
```
/tdd-feature
```

**Qué hace:**
1. Lee user story de `requeriments.md`
2. Crea ticket en Linear
3. Crea branch sincronizada
4. Implementa tests (RED phase)
5. Implementa lógica (GREEN phase)
6. Opcionalmente refactoriza (REFACTOR phase)
7. Hace commit con mejores prácticas

**Confirmaciones:**
El comando pide confirmación en puntos clave para darte control total.

---

## Flujo Completo Paso a Paso

### 1️⃣ Crear Ticket en Linear

**Comando:** `/create-linear-ticket`

```
👤 Usuario:
/tdd-feature

🤖 Claude:
¿Qué user story quieres implementar?

Opciones en requeriments.md:
1. Migraciones de base de datos con UUID
2. Implement product CRUD
3. User authentication with JWT

👤 Usuario:
2

🤖 Claude:
✅ Ticket content generated!

Copy this to Linear:
[Muestra contenido del ticket]

Once created, tell me the ticket ID (e.g., FER-15)

👤 Usuario:
FER-15

🤖 Claude:
✅ Ticket FER-15 saved
Continuing to next step...
```

**Archivos creados:**
- `.linear/pending-ticket.md` - Contenido para Linear
- `.linear/FER-15.json` - Metadata del ticket

---

### 2️⃣ Crear Branch TDD

**Comando:** `/setup-tdd-branch FER-15`

```
🤖 Claude (Haiku):
Checking git status...
✅ Repository clean

Creating branch feature/FER-15-product-crud...
✅ Branch created

Setting up test structure...
✅ test/unit/ ready
✅ test/integration/ ready
✅ test/e2e/ ready

✅ TDD Environment Ready!
```

**Branch creada:**
```bash
feature/FER-15-product-crud
```

---

### 3️⃣ Implementar Tests (RED Phase)

**Comando:** `/implement-tests`

```
🤖 Claude (Sonnet):
Reading ticket FER-15...
✅ Found 4 acceptance criteria

Creating unit tests...
✅ 8 unit tests created

Creating integration tests...
✅ 4 integration tests created

Creating e2e tests...
✅ 3 e2e tests created

Running tests to confirm RED phase...
❌ 15 tests failing (expected ✓)

✅ RED Phase Complete!
All tests are failing as expected.

Continue with implementation? (yes/no)
```

**Tests creados:**
```
test/unit/product/
├── create-product.use-case.spec.ts (FAILING)
├── find-product.use-case.spec.ts (FAILING)
└── update-product.use-case.spec.ts (FAILING)

test/integration/product/
└── typeorm-product.repository.spec.ts (FAILING)

test/e2e/
└── product.e2e-spec.ts (FAILING)
```

---

### 4️⃣ Implementar Lógica (GREEN Phase)

**Comando:** `/implement-logic`

```
👤 Usuario:
yes

🤖 Claude (Opus):
Analyzing failing tests...
✅ Implementation plan created

Implementing Domain Layer...
✅ Product entity
✅ ProductName value object
✅ Repository interface

Running tests... (3/15 passing)

Implementing Application Layer...
✅ Use cases created

Running tests... (8/15 passing)

Implementing Infrastructure Layer...
✅ TypeORM schema
✅ Repository implementation
✅ Mappers

Running tests... (12/15 passing)

Implementing Presentation Layer...
✅ Controllers
✅ DTOs

Running tests... (15/15 passing ✓)

Generating migration...
✅ AddProducts migration created

✅ GREEN Phase Complete!
All 15 tests are passing!

Refactor code? (yes/no/skip)
```

**Código creado:**
```
src/product/
├── domain/
│   ├── entities/product.entity.ts
│   ├── value-objects/product-name.vo.ts
│   ├── exceptions/product-not-found.exception.ts
│   └── repositories/product-repository.interface.ts
├── application/
│   ├── use-cases/create-product.use-case.ts
│   └── dto/create-product.dto.ts
├── infrastructure/
│   ├── persistence/product.schema.ts
│   ├── persistence/typeorm-product.repository.ts
│   └── mappers/product.mapper.ts
├── presentation/
│   ├── controllers/create-product.controller.ts
│   └── dto/product-response.dto.ts
└── product.module.ts

src/database/migrations/
└── 1234567890-AddProducts.ts
```

---

### 5️⃣ Refactorizar (REFACTOR Phase) - OPCIONAL

```
👤 Usuario:
yes

🤖 Claude (Sonnet):
Analyzing code for improvements...

✅ Extracted repeated validation logic
✅ Improved variable names
✅ Applied SOLID principles
✅ Removed code duplication

Running tests after refactoring...
✅ 15/15 tests still passing

Code quality improved!
```

---

### 6️⃣ Commit Changes

**Comando:** `/commit-changes`

```
👤 Usuario:
skip (or yes to refactor)

🤖 Claude (Haiku):
Running pre-commit checks...

✅ Lint: PASSED
✅ Tests: PASSED (15/15)
✅ Coverage: 87%

Creating commit...

feat(product): implement product CRUD with hexagonal architecture

- Created Product domain entity with validation
- Implemented 5 use cases
- Added TypeORM schema with UUID v7
- Created controllers (one per endpoint)
- Added 15 tests (87% coverage)
- Generated migration AddProducts

Closes FER-15

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>

✅ Commit created: a1b2c3d

Push to remote? (yes/no)
```

---

## Sub-Comandos Disponibles

Puedes ejecutar pasos individuales:

| Comando | Modelo | Qué hace |
|---------|--------|----------|
| `/create-linear-ticket` | Sonnet | Genera contenido para ticket |
| `/setup-tdd-branch FER-X` | Haiku | Crea branch y estructura |
| `/implement-tests` | Sonnet/Opus | Crea tests vacíos (RED) |
| `/implement-logic` | Opus | Implementa código (GREEN) |
| `/commit-changes` | Haiku | Commit con mejores prácticas |

---

## Optimización de Recursos

### Uso de Modelos según Complejidad

| Fase | Modelo | Costo | Razón |
|------|--------|-------|-------|
| Crear ticket | Sonnet | $$ | Necesita contexto + API |
| Crear branch | **Haiku** | $ | Git simple |
| Implementar tests | Sonnet/Opus | $$$ | Análisis de requisitos |
| Implementar lógica | **Opus** | $$$$ | Arquitectura compleja |
| Refactorizar | Sonnet | $$ | Mejoras de código |
| Commit | **Haiku** | $ | Formateo simple |

**Optimización automática:**
Claude selecciona el modelo apropiado según la complejidad detectada.

**Ahorro estimado:** ~40% vs usar solo Opus

---

## Ejemplos Prácticos

### Ejemplo 1: Feature Completo (CRUD)

```bash
# Ejecutar flujo completo
/tdd-feature

# Responder preguntas:
# 1. User story: "Implement product CRUD"
# 2. Ticket ID (después de crear en Linear): FER-15
# 3. ¿Continuar con implementación? yes
# 4. ¿Refactorizar? skip
# 5. ¿Commit? yes

# Resultado:
# ✅ Ticket FER-15 creado
# ✅ Branch feature/FER-15-product-crud
# ✅ 15 tests creados y pasando
# ✅ Código implementado con arquitectura hexagonal
# ✅ Migración generada
# ✅ Commit realizado
```

**Tiempo estimado:** 10-15 minutos
**Tests creados:** 15
**Coverage:** ~85%

---

### Ejemplo 2: Solo Tests (para Feature Existente)

```bash
# Si ya tienes código y quieres agregar tests
/implement-tests

# Claude:
# - Lee código existente
# - Crea tests para cubrir funcionalidad
# - Ejecuta tests (deben pasar si el código existe)
```

---

### Ejemplo 3: Fix de Bug con TDD

```bash
# 1. Primero crear test que reproduce el bug
/implement-tests

# (Escribir test que falla debido al bug)

# 2. Implementar fix
/implement-logic

# 3. Commit
/commit-changes
```

---

## Archivo de Referencia: requeriments.md

Estructura recomendada para tus user stories:

```gherkin
Feature: Nombre del Feature

Scenario: Descripción del escenario
  Given [precondición]
  And [otra precondición]
  When [acción]
  Then [resultado esperado]
  And [otro resultado]

  # Detalles adicionales
  And [criterio de aceptación detallado]
```

**Ejemplo real:**

```gherkin
Feature: Product CRUD Management

Scenario: Create a new product
  Given the user has admin permissions
  And the product name is unique
  When the user submits product data
  Then a new product should be created
  And the product should have a UUID v7 identifier
  And the product should be persisted in the database

  # Campos requeridos
  And the product must have: name, price, description
  And name must be between 3-100 characters
  And price must be greater than 0
```

---

## Validaciones Automáticas

El flujo TDD incluye validaciones en cada paso:

### Pre-Commit
- ✅ Linting pass
- ✅ Tests pass (100%)
- ✅ Coverage >= 80%
- ✅ No archivos sensibles

### Pre-Tests
- ✅ Git repository clean
- ✅ On correct branch
- ✅ Dependencies installed

### Pre-Logic
- ✅ Tests exist and fail (RED)
- ✅ Test structure valid

---

## Metadata de Tickets (.linear/)

El flujo crea archivos de metadata para tracking:

```json
// .linear/FER-15.json
{
  "ticketId": "FER-15",
  "title": "Implement product CRUD",
  "branch": "feature/FER-15-product-crud",
  "status": "ready_for_review",
  "startedAt": "2025-10-25T10:00:00Z",
  "completedAt": "2025-10-25T11:30:00Z",
  "commits": [
    {
      "hash": "a1b2c3d",
      "message": "feat(product): implement product CRUD...",
      "timestamp": "2025-10-25T11:30:00Z"
    }
  ],
  "tests": {
    "unit": 8,
    "integration": 4,
    "e2e": 3,
    "total": 15,
    "coverage": "87%"
  }
}
```

---

## Tips y Best Practices

### 1. Un Feature = Una Branch = Un Ticket

```
✅ BIEN:
feature/FER-15-product-crud (1 ticket, 1 feature)

❌ MAL:
feature/multiple-features (varios tickets mezclados)
```

### 2. Tests Primero, Siempre

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR

Nunca: 🟢 GREEN → 🔴 RED
```

### 3. Commits Atómicos

Cada commit debe ser una unidad completa:

```
✅ BIEN:
feat(product): implement product CRUD
(Todo el CRUD completo y funcionando)

❌ MAL:
feat(product): WIP
feat(product): more changes
feat(product): finally done
```

### 4. Coverage Mínimo

- Apunta a **>80%** coverage
- Los comandos validan esto automáticamente

---

## Troubleshooting

### Tests no fallan en RED phase

**Problema:** Los tests pasan aunque no hay implementación

**Solución:**
- Revisa que los tests tengan `expect(true).toBe(false)` inicialmente
- Verifica que no haya código de implementación anterior

---

### Modelo incorrecto para la tarea

**Problema:** Se usa Opus para tarea simple (desperdicio)

**Solución:**
- El comando `/tdd-feature` selecciona automáticamente
- Puedes usar sub-comandos individuales si quieres control manual

---

### Linear MCP no disponible

**Problema:** No puedo crear tickets automáticamente

**Solución actual:**
- El comando genera `.linear/pending-ticket.md`
- Copias el contenido a Linear manualmente
- Informas el ID a Claude
- **Futuro:** Integración automática cuando MCP esté disponible

---

## Próximos Pasos

Después de completar el flujo TDD:

1. **Push a remote:**
   ```bash
   git push origin feature/FER-15-product-crud
   ```

2. **Crear PR:**
   ```
   /review-pr
   ```

3. **O continuar trabajando:**
   - Añadir más tests
   - Refactorizar
   - Añadir documentación

---

## Resumen Rápido

```bash
# Flujo completo en un comando
/tdd-feature

# O paso a paso:
/create-linear-ticket          # 1. Ticket
/setup-tdd-branch FER-15       # 2. Branch
/implement-tests               # 3. Tests (RED)
/implement-logic               # 4. Code (GREEN)
/commit-changes                # 5. Commit
/review-pr                     # 6. PR
```

---

**Creado:** 2025-10-25
**Versión:** 1.0
**Autor:** Sistema TDD del Proyecto
