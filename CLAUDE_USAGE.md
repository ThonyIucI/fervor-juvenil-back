# Claude Code - Guía de Uso

Esta guía explica cómo aprovechar al máximo Claude Code en este proyecto.

## 📋 Tabla de Contenidos

1. [Archivos de Referencia](#archivos-de-referencia)
2. [Comandos Slash Disponibles](#comandos-slash-disponibles)
3. [Flujo TDD Completo](#flujo-tdd-completo) ⭐ NUEVO
4. [Flujos de Trabajo Comunes](#flujos-de-trabajo-comunes)
5. [Best Practices](#best-practices)

---

## 📚 Archivos de Referencia

Claude Code lee automáticamente estos archivos para entender tu proyecto:

### 1. `CLAUDE.md` - Fuente Principal de Verdad
**Qué contiene:**
- Configuración del proyecto (NestJS, TypeORM, PostgreSQL)
- Comandos de desarrollo
- Arquitectura hexagonal
- Estándares de código
- Convenciones de nombrado
- Guías de testing

**Cuándo actualizar:**
- Cuando cambien las reglas de arquitectura
- Al agregar nuevas convenciones
- Cuando se modifiquen los comandos npm

### 2. `context/db-structure.sql` - Esquema de Base de Datos
**Qué contiene:**
- Estructura completa de todas las tablas
- Tipos de datos
- Relaciones (FK)
- Índices
- Comentarios explicativos

**Cuándo actualizar:**
- Después de cada migración
- Usa el comando: `/update-db-context`

### 3. `src/user/README.md` - Ejemplo de Arquitectura
**Qué contiene:**
- Implementación de referencia de arquitectura hexagonal
- Ejemplos de cada capa
- Mappers, DTOs, Use Cases

**Cuándo consultar:**
- Antes de crear un nuevo módulo
- Para entender el patrón correcto

---

## 🎯 Comandos Slash Disponibles

Los comandos slash son atajos para tareas comunes. Úsalos escribiendo `/comando` en el chat.

### `/new-module <nombre>`

**Propósito:** Crear un módulo completo con arquitectura hexagonal

**Ejemplo:**
```
/new-module product
```

**Qué hace:**
1. Te pregunta sobre campos y relaciones
2. Crea toda la estructura de carpetas
3. Genera domain entities, use cases, controllers
4. Crea schemas de TypeORM
5. Genera mappers
6. Sugiere la migración a ejecutar

**Cuándo usar:**
- Al iniciar un nuevo feature
- Cuando necesites un CRUD completo

---

### `/review-pr`

**Propósito:** Revisar código antes de crear un Pull Request

**Ejemplo:**
```
/review-pr
```

**Qué hace:**
1. Verifica git status y cambios
2. Valida estándares de código
3. Revisa arquitectura hexagonal
4. Verifica tests y coverage
5. Chequea linting y formato
6. Genera un resumen para el PR

**Cuándo usar:**
- Antes de hacer commit importante
- Antes de crear un PR
- Para auto-revisar tu código

---

### `/update-db-context`

**Propósito:** Sincronizar `context/db-structure.sql` con las migraciones

**Ejemplo:**
```
/update-db-context
```

**Qué hace:**
1. Lee todas las migraciones
2. Analiza la más reciente
3. Actualiza `context/db-structure.sql`
4. Documenta relaciones

**Cuándo usar:**
- Después de ejecutar migraciones
- Después de generar migraciones nuevas
- Cuando el schema SQL esté desactualizado

---

### `/test-module <nombre>`

**Propósito:** Generar tests completos para un módulo

**Ejemplo:**
```
/test-module user
```

**Qué hace:**
1. Analiza el módulo existente
2. Genera unit tests para use cases
3. Crea integration tests para repositorios
4. Genera e2e tests
5. Configura mocks apropiados

**Cuándo usar:**
- Después de crear un módulo
- Cuando necesites mejorar coverage
- Para agregar tests faltantes

---

### `/tdd-feature` ⭐ NUEVO

**Propósito:** Flujo completo TDD desde ticket hasta commit

**Ejemplo:**
```
/tdd-feature
```

**Qué hace:**
1. Lee user story de `requeriments.md`
2. Crea ticket en Linear
3. Crea branch sincronizada
4. Implementa tests (RED phase)
5. Implementa lógica (GREEN phase)
6. Opcionalmente refactoriza
7. Hace commit con mejores prácticas

**Cuándo usar:**
- Al iniciar un nuevo feature
- Cuando quieres seguir TDD estricto
- Para features con criterios de aceptación claros

**Ver guía completa:** [TDD_WORKFLOW.md](TDD_WORKFLOW.md)

---

### Sub-Comandos TDD

Pasos individuales del flujo TDD:

| Comando | Qué hace |
|---------|----------|
| `/create-linear-ticket` | Genera contenido para ticket Linear |
| `/setup-tdd-branch FER-X` | Crea branch y estructura de tests |
| `/implement-tests` | Crea tests vacíos (RED phase) |
| `/implement-logic` | Implementa código (GREEN phase) |
| `/commit-changes` | Commit con convenciones |

---

## 🎯 Flujo TDD Completo

### Metodología Test-Driven Development

Este proyecto sigue **TDD estricto** para garantizar calidad:

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

### Comando Principal: `/tdd-feature`

**Flujo automatizado completo:**

```
1. User Story (requeriments.md)
   ↓
2. Ticket Linear (FER-X)
   ↓
3. Branch (feature/FER-X-descripcion)
   ↓
4. Tests RED (fallan inicialmente)
   ↓
5. Código GREEN (tests pasan)
   ↓
6. Refactor (opcional)
   ↓
7. Commit (conventional commits)
```

### Ejemplo Rápido

```bash
# 1. Ejecutar comando principal
/tdd-feature

# 2. Seleccionar user story
👤: "User story #2: Product CRUD"

# 3. Crear ticket en Linear (manual por ahora)
👤: "FER-15"

# 4. Confirmar implementación de tests
👤: "yes"

# 5. Confirmar implementación de lógica
👤: "yes"

# 6. ¿Refactorizar?
👤: "skip"

# 7. ¿Commit?
👤: "yes"

# ✅ Resultado:
# - 15 tests creados y pasando
# - Código con arquitectura hexagonal
# - Migración generada
# - Commit realizado
# - Listo para PR
```

### Optimización de Recursos (Modelos)

| Fase | Modelo | Razón |
|------|--------|-------|
| Crear ticket | Sonnet | Contexto + API |
| Crear branch | **Haiku** | Git simple |
| Tests (RED) | Sonnet/Opus | Análisis requisitos |
| Lógica (GREEN) | **Opus** | Arquitectura compleja |
| Refactor | Sonnet | Mejoras código |
| Commit | **Haiku** | Formateo mensajes |

**Ahorro estimado:** ~40% vs usar solo Opus

### Guía Completa

Para documentación detallada del flujo TDD, ver:
**[TDD_WORKFLOW.md](TDD_WORKFLOW.md)** - Guía completa con ejemplos

---

## 🔄 Flujos de Trabajo Comunes

### Flujo 1: Crear un Nuevo Feature

```
1. Usuario: "/new-module order"
2. Claude: [Hace preguntas sobre campos y relaciones]
3. Usuario: [Responde las preguntas]
4. Claude: [Crea todo el módulo]
5. Usuario: "Genera la migración"
6. Claude: [Ejecuta comando de migración]
7. Usuario: "/update-db-context"
8. Claude: [Actualiza context/db-structure.sql]
9. Usuario: "/test-module order"
10. Claude: [Genera tests]
11. Usuario: "/review-pr"
12. Claude: [Revisa todo y genera resumen]
```

---

### Flujo 2: Modificar Base de Datos

```
1. Usuario: "Agrega campo 'avatar_url' a la tabla users"
2. Claude: [Modifica user.schema.ts]
3. Usuario: "Genera la migración"
4. Claude: [Genera migración]
5. Usuario: "Ejecuta la migración"
6. Claude: [Ejecuta npm run m:run-dev]
7. Usuario: "/update-db-context"
8. Claude: [Actualiza context/db-structure.sql]
```

---

### Flujo 3: Preparar Pull Request

```
1. Usuario: "He terminado el feature de productos"
2. Claude: "¿Quieres que revise el código?"
3. Usuario: "/review-pr"
4. Claude: [Ejecuta todas las validaciones]
5. Claude: [Muestra resumen con checklist]
6. Usuario: "Crea el PR"
7. Claude: [Genera y crea el PR en GitHub]
```

---

## ✅ Best Practices

### 1. Mantén los Archivos de Referencia Actualizados

**❌ Mal:**
```
- Crear migraciones y no actualizar context/db-structure.sql
- Cambiar convenciones sin actualizar CLAUDE.md
```

**✅ Bien:**
```
- Después de cada migración: /update-db-context
- Al cambiar reglas: actualizar CLAUDE.md inmediatamente
```

---

### 2. Usa Comandos Slash para Tareas Repetitivas

**❌ Mal:**
```
Usuario: "Crea un módulo product con domain entity, use cases, controllers..."
[Claude tiene que preguntar muchas cosas]
```

**✅ Bien:**
```
Usuario: "/new-module product"
[Claude sigue un flujo predefinido y eficiente]
```

---

### 3. Revisa Antes de Commitear

**❌ Mal:**
```
git add .
git commit -m "feat: add products"
git push
[Luego descubres errores de linting o tests fallando]
```

**✅ Bien:**
```
Usuario: "/review-pr"
[Claude revisa todo]
Usuario: "Corrige los errores que encontraste"
[Luego commit]
```

---

### 4. Consulta el Módulo User como Referencia

**❌ Mal:**
```
Usuario: "Crea un módulo pero con arquitectura diferente"
[Rompe la consistencia del proyecto]
```

**✅ Bien:**
```
Usuario: "/new-module product"
[Claude usa src/user/ como template, mantiene consistencia]
```

---

## 🎓 Ejemplos de Interacciones

### Ejemplo 1: Crear Módulo Completo

```
👤 Usuario:
/new-module category

🤖 Claude:
I'll help you create a new Category module. Let me ask a few questions:

1. What fields should the Category entity have?
2. Does it have relationships with other entities?
3. Any special validations or business rules?

👤 Usuario:
1. name (string), description (text), isActive (boolean)
2. One category has many products
3. Name must be unique

🤖 Claude:
Perfect! I'll create the complete Category module with:
- Domain entity with validation
- CRUD use cases
- TypeORM schema with unique constraint
- Controllers for each endpoint
- DTOs for input/output

[Crea todos los archivos]

Now let's generate the migration:
[Ejecuta: npm run typeorm -- migration:generate...]

Migration created successfully!

Would you like me to:
1. Run the migration?
2. Generate tests?
3. Update db context?
```

---

### Ejemplo 2: Revisar Código

```
👤 Usuario:
/review-pr

🤖 Claude:
I'll review your recent changes...

✅ Code Standards: Passed
✅ Architecture: Passed
✅ Tests: 85% coverage (target: 80%)
❌ Linting: 3 errors found in product.controller.ts
✅ DB Context: Up to date

Issues found:
1. product.controller.ts:15 - Missing return type
2. product.controller.ts:23 - Unused import
3. product.service.ts:42 - Using 'any' type

Would you like me to fix these issues?

👤 Usuario:
Sí, corrígelos

🤖 Claude:
[Corrige los 3 issues]

All issues fixed! Running final checks...

✅ All checks passed!

PR Summary:
- Added Product CRUD module
- Created 5 controllers, 5 use cases
- Migration: AddProducts1234567890.ts
- Test coverage: 85%

Ready to create PR?
```

---

## 📝 Notas Importantes

1. **Los comandos slash solo funcionan en Claude Code (extensión VSCode)**
   - No están disponibles en chat.anthropic.com

2. **CLAUDE.md se lee automáticamente**
   - No necesitas decir "lee CLAUDE.md"
   - Claude ya conoce las reglas

3. **context/db-structure.sql es tu fuente de verdad**
   - Mantenerla actualizada ayuda a Claude a generar código correcto
   - Úsala como referencia cuando implementes repositorios

4. **Los comandos pueden personalizarse**
   - Edita archivos en `.claude/commands/`
   - Agrega tus propios comandos

---

## 🆘 Troubleshooting

### Problema: Claude no sigue las convenciones

**Solución:**
1. Verifica que CLAUDE.md esté actualizado
2. Menciona explícitamente: "Sigue las reglas de CLAUDE.md"
3. Referencia el módulo user: "Usa src/user/ como ejemplo"

---

### Problema: Migraciones generan UUID v4 en lugar de v7

**Solución:**
1. Revisa que los schemas usen `@PrimaryColumn('uuid')`
2. NO uses `@PrimaryGeneratedColumn('uuid')`
3. Consulta CLAUDE.md sección "Database Schema Standards"

---

### Problema: Tests no se generan correctamente

**Solución:**
1. Usa `/test-module <nombre>` en lugar de pedir manualmente
2. Asegúrate que el módulo esté completo antes de generar tests

---

## 📞 Soporte

Si tienes dudas:
1. Consulta este archivo (CLAUDE_USAGE.md)
2. Revisa CLAUDE.md para convenciones técnicas
3. Mira src/user/ como ejemplo de implementación
4. Pregunta a Claude: "¿Cómo debería hacer X según las reglas del proyecto?"

---

**Última actualización:** 2025-10-25
