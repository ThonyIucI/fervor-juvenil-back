# Create Linear Ticket

**Modelo recomendado:** Sonnet (requiere contexto y API calls)

## Descripción

Crea un ticket en Linear basado en una user story de `requeriments.md`.

## Instrucciones

### Paso 1: Obtener User Story

1. Pedir al usuario qué user story usar (o número de línea)
2. Leer `requeriments.md`
3. Extraer la user story completa con criterios de aceptación

### Paso 2: Analizar y Estructurar

Extraer de la user story:

- **Título**: Resumir en 5-7 palabras
- **Descripción**: Descripción clara del feature
- **Criterios de Aceptación**: Lista de Given/When/Then
- **Labels**: Detectar automáticamente (backend, database, feature, etc.)
- **Priority**: Basado en urgencia (high, medium, low)

### Paso 3: Crear Ticket

**IMPORTANTE:** Por ahora, como Linear MCP no está disponible en tu entorno, vamos a:

1. Generar el contenido del ticket en formato markdown
2. Crear un archivo temporal: `.linear/pending-ticket.md`
3. Mostrar instrucciones para crearlo manualmente en Linear
4. Pedir al usuario el ID una vez creado (ej: FER-13)

Formato del ticket:

```markdown
# [Título del Feature]

## Description
[Descripción detallada]

## Acceptance Criteria
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## Technical Notes
- Module: [nombre del módulo]
- Estimated complexity: [Low/Medium/High]
- Requires migration: [Yes/No]

## Labels
`backend` `database` `feature`

## Priority
High

---
🤖 Generated with Claude Code
```

### Paso 4: Guardar Información

Crear archivo `.linear/FER-X.json` con metadata:

```json
{
  "ticketId": "FER-13",
  "title": "Implement UUID v7 migrations",
  "userStory": "[texto completo]",
  "acceptanceCriteria": [],
  "branch": "feature/FER-13-uuid-migrations",
  "status": "in_progress",
  "createdAt": "2025-10-25T10:00:00Z"
}
```

### Paso 5: Output

Mostrar:

```
✅ Ticket content generated!

📋 Next steps:
1. Copy the content from .linear/pending-ticket.md
2. Create the ticket manually in Linear: https://linear.app/your-workspace
3. Get the ticket ID (e.g., FER-13)
4. Tell me the ID to continue

Or run: /setup-tdd-branch FER-13
```

## Ejemplo

```
👤 Usuario:
/create-linear-ticket

🤖 Claude:
¿Qué user story quieres usar?

Opciones en requeriments.md:
1. Migraciones de base de datos con UUID
2. [Otra]

👤 Usuario:
1

🤖 Claude:
Generando contenido del ticket...

✅ Ticket content saved to .linear/pending-ticket.md

📋 **Copy this to Linear:**

Title: Implement UUID v7 migrations for PostgreSQL

Description:
Create database migrations using UUID version 7 for all entities...

[Muestra contenido completo]

Once you create the ticket in Linear, tell me the ID (e.g., FER-13)
```

## Integración Futura con Linear MCP

Cuando Linear MCP esté disponible, actualizar este comando para:

```typescript
// Usar Linear MCP tools
const ticket = await linear.createIssue({
  title: title,
  description: description,
  teamId: teamId,
  labels: ['backend', 'database']
})

return ticket.id  // FER-13
```

## Validaciones

- ✅ requeriments.md existe
- ✅ User story tiene criterios de aceptación
- ✅ Directorio .linear/ existe (crear si no)
