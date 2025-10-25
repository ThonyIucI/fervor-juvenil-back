# TDD Feature Workflow (Orchestrator)

**COMANDO PRINCIPAL** - Flujo completo desde ticket en Linear hasta commit, siguiendo TDD.

## Descripción

Este comando orquesta el flujo completo de desarrollo de un feature usando TDD:
1. Crear ticket en Linear basado en user story
2. Crear branch sincronizada con Linear
3. Implementar tests (TDD - Red phase)
4. Implementar lógica (TDD - Green phase)
5. Refactorizar si es necesario (TDD - Refactor phase)
6. Commit con mejores prácticas

## Instrucciones

### Paso 1: Leer User Story

1. Pedir al usuario el número/nombre de la user story en `requeriments.md`
2. Si no especifica, mostrar lista de user stories disponibles en el archivo
3. Leer la user story completa con sus criterios de aceptación

### Paso 2: Crear Ticket en Linear

Ejecutar el flujo `/create-linear-ticket` (sub-comando):
- Analizar la user story
- Extraer título, descripción, criterios de aceptación
- Crear el ticket en Linear
- Obtener el ID del ticket (ej: FER-12)

### Paso 3: Crear Branch TDD

Ejecutar el flujo `/setup-tdd-branch` (sub-comando):
- Crear branch: `feature/FER-X-descripcion-corta`
- Hacer checkout a la nueva branch
- Confirmar que estamos en la branch correcta

### Paso 4: Implementar Tests (RED Phase)

Ejecutar el flujo `/implement-tests` (sub-comando):
- Analizar criterios de aceptación
- Identificar qué módulos/archivos se necesitan
- Crear tests unitarios vacíos (failing tests)
- Crear tests de integración vacíos
- Crear tests e2e según corresponda
- Ejecutar tests para confirmar que FALLAN (RED)

**Confirmar con usuario:** "Tests creados y fallando (RED phase). ¿Continuar con implementación?"

### Paso 5: Implementar Lógica (GREEN Phase)

Ejecutar el flujo `/implement-logic` (sub-comando):
- Implementar el código mínimo necesario para pasar los tests
- Usar in-memory database para tests
- Ejecutar tests iterativamente hasta que PASEN (GREEN)
- Si es necesario, generar migraciones para DB real

**Confirmar con usuario:** "Todos los tests pasan (GREEN phase). ¿Refactorizar código?"

### Paso 6: Refactorizar (REFACTOR Phase) - OPCIONAL

Si el usuario confirma:
- Revisar código para mejoras
- Aplicar principios SOLID
- Mejorar nombres de variables/funciones
- Eliminar código duplicado
- Ejecutar tests después de cada cambio

### Paso 7: Commit Changes

Ejecutar el flujo `/commit-changes` (sub-comando):
- Ejecutar `/review-pr` para validar todo
- Generar mensaje de commit siguiendo convenciones
- Hacer commit con co-authored-by Claude
- Preguntar si crear PR ahora o después

## Modelo Recomendado por Fase

Para optimizar recursos, usa diferentes modelos según la complejidad:

| Fase | Modelo | Razón |
|------|--------|-------|
| 1. Leer user story | Haiku | Lectura simple |
| 2. Crear ticket Linear | Sonnet | Necesita contexto y API calls |
| 3. Crear branch | Haiku | Comandos git simples |
| 4. Implementar tests | **Sonnet/Opus** | Requiere análisis de requisitos |
| 5. Implementar lógica | **Opus** | Lógica compleja, arquitectura |
| 6. Refactorizar | Sonnet | Mejoras de código |
| 7. Commit | Haiku | Formateo de mensajes |

**Nota:** El modelo se ajusta automáticamente según la complejidad detectada.

## Flujo de Confirmaciones

Para dar control al usuario, confirmar en puntos clave:

1. ✋ Después de crear ticket: "Ticket FER-X creado. ¿Continuar?"
2. ✋ Después de tests RED: "Tests fallando. ¿Implementar lógica?"
3. ✋ Después de tests GREEN: "Tests pasando. ¿Refactorizar?"
4. ✋ Antes de commit: "¿Hacer commit ahora?"

## Ejemplo de Uso

```
👤 Usuario:
/tdd-feature

🤖 Claude (Haiku):
¿Qué user story quieres implementar?

Opciones disponibles en requeriments.md:
1. Migraciones de base de datos con UUID
2. [Otra user story]
3. [Otra user story]

👤 Usuario:
La número 1

🤖 Claude (Sonnet):
Perfecto! Voy a trabajar en la user story:
"Migraciones de base de datos con UUID en PostgreSQL"

Paso 1/7: Creando ticket en Linear...
✅ Ticket creado: FER-13

Paso 2/7: Creando branch feature/FER-13-database-uuid-migrations...
✅ Branch creada y checkout realizado

Paso 3/7: Implementando tests (RED phase)...
✅ Tests creados (12 tests fallando)

¿Continuar con implementación de lógica? (yes/no)

👤 Usuario:
yes

🤖 Claude (Opus):
Paso 4/7: Implementando lógica (GREEN phase)...
[Implementa código]
✅ Todos los tests pasan (12/12)

¿Refactorizar código? (yes/no/skip)

👤 Usuario:
skip

🤖 Claude (Haiku):
Paso 5/7: Preparando commit...
✅ Código validado
✅ Mensaje de commit generado

¿Hacer commit ahora? (yes/no)

👤 Usuario:
yes

🤖 Claude:
✅ Commit realizado: "feat: implement database uuid migrations (FER-13)"

¿Crear Pull Request ahora? (yes/no)
```

## Sub-Comandos Disponibles

Puedes ejecutar pasos individuales si lo prefieres:

- `/create-linear-ticket` - Solo crear ticket
- `/setup-tdd-branch` - Solo crear branch
- `/implement-tests` - Solo implementar tests
- `/implement-logic` - Solo implementar lógica
- `/commit-changes` - Solo hacer commit

## Archivo de Referencia

- **requeriments.md** - Contiene las user stories
- **CLAUDE.md** - Estándares de código
- **context/db-structure.sql** - Schema de DB

## Validaciones Automáticas

Antes de cada paso, validar:

1. ✅ Git repositorio limpio (no uncommitted changes) antes de crear branch
2. ✅ Estamos en la branch correcta
3. ✅ Tests ejecutables (`npm run test`)
4. ✅ Linting pasa (`npm run lint`)
5. ✅ Migraciones ejecutadas si es necesario

## Manejo de Errores

Si algo falla en cualquier paso:

1. Mostrar error claro
2. Explicar qué salió mal
3. Sugerir solución
4. Preguntar si reintentar o abortar

## Output Final

Al completar todo el flujo:

```markdown
## ✅ Feature Completado

**Ticket:** FER-13 - Database UUID migrations
**Branch:** feature/FER-13-database-uuid-migrations
**Tests:** 12/12 passing
**Commits:** 1 commit creado

### Siguiente paso:
- Crear PR: /review-pr
- O continuar trabajando en la branch
```
