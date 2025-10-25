# Setup TDD Branch

**Modelo recomendado:** Haiku (operaciones git simples)

## Descripción

Crea una nueva branch sincronizada con el ticket de Linear y prepara el entorno para TDD.

## Instrucciones

### Paso 1: Validar Estado Git

```bash
# Verificar que no hay cambios sin commitear
git status

# Si hay cambios:
# - Preguntar al usuario si hacer commit o stash
# - Si commit: ejecutar /commit-changes primero
# - Si stash: git stash save "WIP before FER-X"
```

### Paso 2: Actualizar desde Main

```bash
# Asegurar que estamos en la última versión
git checkout main
git pull origin main
```

### Paso 3: Crear Branch

Formato de nombre: `feature/FER-X-descripcion-corta`

Ejemplos:
- `feature/FER-13-uuid-migrations`
- `feature/FER-14-user-authentication`
- `feature/FER-15-product-crud`

```bash
git checkout -b feature/FER-X-descripcion
```

### Paso 4: Sincronizar con Linear (Metadata)

Crear/actualizar `.linear/FER-X.json`:

```json
{
  "ticketId": "FER-13",
  "branch": "feature/FER-13-uuid-migrations",
  "status": "in_progress",
  "startedAt": "2025-10-25T10:30:00Z",
  "commits": []
}
```

### Paso 5: Preparar Estructura TDD

Crear directorio para tests si no existe:

```bash
mkdir -p test/
mkdir -p test/unit/
mkdir -p test/integration/
mkdir -p test/e2e/
```

### Paso 6: Confirmar Setup

Ejecutar:

```bash
# Verificar branch actual
git branch --show-current

# Verificar que podemos ejecutar tests
npm run test -- --version

# Verificar que la DB está disponible (opcional)
# Intentar conexión a DB o verificar docker
```

### Paso 7: Output

Mostrar resumen:

```
✅ TDD Environment Ready!

📋 Branch Info:
- Branch: feature/FER-13-uuid-migrations
- Based on: main (up to date)
- Ticket: FER-13
- Status: In Progress

📁 Test Structure:
- test/unit/ ✅
- test/integration/ ✅
- test/e2e/ ✅

🎯 Next Step:
Run: /implement-tests
Or: Manually create tests and run npm run test
```

## Validaciones

- ✅ Git repositorio limpio antes de crear branch
- ✅ Main branch actualizada
- ✅ Branch creada correctamente
- ✅ NPM dependencies instaladas
- ✅ Tests ejecutables

## Manejo de Errores

### Error: Cambios sin commitear

```
❌ You have uncommitted changes.

Options:
1. Commit changes: /commit-changes
2. Stash changes: git stash
3. Discard changes: git checkout .

What would you like to do?
```

### Error: Branch ya existe

```
❌ Branch 'feature/FER-13-uuid-migrations' already exists.

Options:
1. Switch to existing branch: git checkout feature/FER-13-uuid-migrations
2. Delete and recreate: git branch -D feature/FER-13-uuid-migrations
3. Use different name

What would you like to do?
```

## Integración con Linear (Futuro)

Cuando Linear MCP esté disponible:

```typescript
// Actualizar ticket status en Linear
await linear.updateIssue(ticketId, {
  status: 'In Progress',
  startedAt: new Date()
})

// Vincular branch con ticket
await linear.addComment(ticketId, {
  body: `Started work on branch: feature/FER-13-uuid-migrations`
})
```

## Ejemplo Completo

```
👤 Usuario:
/setup-tdd-branch FER-13

🤖 Claude (Haiku):
Checking git status...
✅ Repository clean

Updating from main...
✅ Already up to date

Creating branch feature/FER-13-uuid-migrations...
✅ Branch created

Setting up test structure...
✅ Test directories ready

✅ TDD Environment Ready!

Next: /implement-tests
```
