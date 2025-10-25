# Commit Changes

**Modelo recomendado:** Haiku (formateo de mensajes, operaciones git simples)

## Descripción

Crea un commit siguiendo las mejores prácticas y convenciones del proyecto.

## Instrucciones

### Paso 1: Ejecutar Pre-Commit Checks

Validar que el código está listo para commit:

```bash
# 1. Ejecutar linter
npm run lint

# 2. Ejecutar tests
npm run test

# 3. Ejecutar tests e2e
npm run test:e2e

# 4. Verificar coverage
npm run test:cov
```

**Si algo falla:**
- Mostrar errores
- Preguntar si arreglar automáticamente o abortar
- Si se arregla, volver a validar

### Paso 2: Revisar Cambios

```bash
# Ver archivos modificados
git status

# Ver diff de cambios
git diff

# Mostrar resumen al usuario
```

Analizar los cambios y categorizarlos:

- 🆕 Nuevos archivos
- ✏️ Archivos modificados
- 🗑️ Archivos eliminados
- 📁 Migraciones
- 🧪 Tests

### Paso 3: Generar Mensaje de Commit

Seguir **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formateo, no cambia lógica
- `refactor`: Refactorización de código
- `test`: Añadir/modificar tests
- `chore`: Cambios en build, config, etc.

#### Scope

Módulo afectado: `user`, `product`, `auth`, `database`, etc.

#### Subject

Resumen conciso en imperativo (máx 50 caracteres):

```
✅ BIEN: "add product CRUD endpoints"
❌ MAL: "added some stuff for products"
```

#### Body

Explicación detallada (opcional si el subject es suficientemente claro):

- ¿Qué cambió?
- ¿Por qué?
- ¿Cómo afecta al sistema?

#### Footer

- Referencias a tickets: `FER-13`
- Breaking changes: `BREAKING CHANGE: ...`
- Co-authored by: `Co-Authored-By: Claude <noreply@anthropic.com>`

### Paso 4: Construir Mensaje

**Ejemplo 1: Feature completo**

```
feat(product): implement product CRUD with hexagonal architecture

- Created Product domain entity with validation
- Implemented 5 use cases (create, find, update, delete, findAll)
- Added TypeORM schema with UUID v7 support
- Created controllers following one-endpoint-per-controller pattern
- Added comprehensive test suite (15 tests, 87% coverage)
- Generated database migration for products table

Closes FER-13

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Ejemplo 2: Fix**

```
fix(auth): validate JWT expiration correctly

Previously, expired tokens were accepted due to incorrect
date comparison in JwtStrategy. Now properly checks token
expiration using Date.now().

Fixes FER-14

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Ejemplo 3: Tests solo**

```
test(user): add integration tests for user repository

Added 8 integration tests covering:
- CRUD operations
- UUID v7 generation
- Unique email constraint
- Relationship with user_profiles

All tests passing with in-memory SQLite database.

Related to FER-13

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Paso 5: Staging de Archivos

```bash
# Stage todos los archivos relevantes
git add .

# O selectivamente:
git add src/product/
git add test/product/
git add src/database/migrations/
git add context/db-structure.sql
```

**Validar que NO se incluyen:**
- ❌ Archivos `.env`
- ❌ Credenciales
- ❌ `node_modules/`
- ❌ Archivos temporales
- ❌ Logs

### Paso 6: Crear Commit

```bash
# Usar HEREDOC para mensaje multi-línea
git commit -m "$(cat <<'EOF'
feat(product): implement product CRUD with hexagonal architecture

- Created Product domain entity with validation
- Implemented 5 use cases (create, find, update, delete, findAll)
- Added TypeORM schema with UUID v7 support
- Created controllers following one-endpoint-per-controller pattern
- Added comprehensive test suite (15 tests, 87% coverage)
- Generated database migration for products table

Closes FER-13

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Paso 7: Verificar Commit

```bash
# Ver último commit
git log -1 --pretty=format:"%h - %an: %s" --stat

# Mostrar resumen al usuario
```

### Paso 8: Actualizar Metadata de Linear

Actualizar `.linear/FER-X.json`:

```json
{
  "ticketId": "FER-13",
  "branch": "feature/FER-13-product-crud",
  "status": "ready_for_review",
  "commits": [
    {
      "hash": "a1b2c3d",
      "message": "feat(product): implement product CRUD...",
      "timestamp": "2025-10-25T11:00:00Z"
    }
  ],
  "completedAt": "2025-10-25T11:00:00Z"
}
```

### Paso 9: Output

```markdown
✅ Commit Created Successfully!

📝 Commit Details:
**Hash:** a1b2c3d
**Type:** feat
**Scope:** product
**Message:** implement product CRUD with hexagonal architecture

📊 Changes Summary:
- 24 files changed
- 1,245 insertions(+)
- 12 deletions(-)

📁 Files Modified:
- src/product/ (15 files)
- test/product/ (8 files)
- src/database/migrations/ (1 file)

✅ Pre-commit Checks:
- Linting: PASSED
- Unit Tests: PASSED (15/15)
- E2E Tests: PASSED (3/3)
- Coverage: 87%

🔗 Ticket: FER-13
📌 Branch: feature/FER-13-product-crud

🎯 Next Steps:
1. Push to remote: git push origin feature/FER-13-product-crud
2. Create PR: /review-pr
3. Or continue working on the feature
```

## Validaciones

- ✅ Linting passed
- ✅ Tests passed
- ✅ Coverage >= 80%
- ✅ No archivos sensibles (.env, credentials)
- ✅ Mensaje de commit sigue Conventional Commits
- ✅ Co-Authored-By included
- ✅ Ticket reference included

## Manejo de Pre-Commit Hooks

Si el proyecto tiene pre-commit hooks que modifican archivos:

```bash
# 1. Hacer commit inicial
git commit -m "message"

# 2. Si hooks modifican archivos
# Verificar si es seguro hacer amend:
git log -1 --format='%an %ae'  # Check authorship
git status  # Check if not pushed

# 3. Si es seguro, amend:
git add .
git commit --amend --no-edit
```

## Mensajes de Commit para Diferentes Tipos

### Feature Completo
```
feat(module): implement feature with tests

[Detailed description]

Closes FER-X
```

### Bug Fix
```
fix(module): correct validation logic

[What was wrong and how it's fixed]

Fixes FER-X
```

### Tests Only
```
test(module): add integration tests

[What tests cover]

Related to FER-X
```

### Refactoring
```
refactor(module): improve code structure

[Why refactored and what improved]

Related to FER-X
```

### Database Migration
```
feat(database): add products table migration

[Schema changes]

Related to FER-X
```

## Ejemplo Completo

```
👤 Usuario:
/commit-changes

🤖 Claude (Haiku):
Running pre-commit checks...

✅ Lint: PASSED
✅ Tests: PASSED (15/15)
✅ E2E: PASSED (3/3)
✅ Coverage: 87%

Analyzing changes...
📁 24 files changed
  - 15 new files (src/product/)
  - 8 test files
  - 1 migration

Generating commit message...

Type: feat
Scope: product
Message: implement product CRUD with hexagonal architecture

Staging files...
✅ 24 files staged

Creating commit...
✅ Commit created: a1b2c3d

Next steps:
1. Push: git push origin feature/FER-13-product-crud
2. Create PR: /review-pr
```

## Integration con Linear (Futuro)

Cuando Linear MCP esté disponible:

```typescript
// Actualizar status del ticket
await linear.updateIssue(ticketId, {
  status: 'Ready for Review',
  completedAt: new Date()
})

// Añadir comentario con commit
await linear.addComment(ticketId, {
  body: `Committed: ${commitHash}\n\n${commitMessage}`
})
```
