# 🚀 Setup Completo de Claude Code

Este archivo explica la configuración completa de Claude Code para este proyecto.

## ✅ Archivos Creados

### 1. Archivos de Referencia (Fuentes de Verdad)

| Archivo | Propósito | Actualizar cuando |
|---------|-----------|-------------------|
| `CLAUDE.md` | Convenciones, arquitectura, estándares | Cambien reglas del proyecto |
| `context/db-structure.sql` | Esquema completo de la DB | Después de migraciones |
| `src/user/README.md` | Ejemplo de arquitectura hexagonal | Ya existe (referencia) |

### 2. Comandos Slash

| Comando | Archivo | Qué hace |
|---------|---------|----------|
| `/new-module` | `.claude/commands/new-module.md` | Crea módulo completo |
| `/review-pr` | `.claude/commands/review-pr.md` | Revisa código antes de PR |
| `/test-module` | `.claude/commands/test-module.md` | Genera tests |
| `/update-db-context` | `.claude/commands/update-db-context.md` | Actualiza esquema SQL |

### 3. Documentación

| Archivo | Contenido |
|---------|-----------|
| `CLAUDE_USAGE.md` | Guía completa de uso (LEE ESTE PRIMERO) |
| `.claude/README.md` | Info sobre comandos slash |
| `SETUP_CLAUDE.md` | Este archivo |

---

## 🎯 Cómo Usar - Quick Start

### Paso 1: Lee la Guía de Uso

```bash
# Abre y lee este archivo:
CLAUDE_USAGE.md
```

Este archivo contiene:
- Explicación de todos los comandos
- Flujos de trabajo completos
- Ejemplos prácticos
- Best practices

### Paso 2: Prueba un Comando

En el chat de Claude Code (extensión VSCode), escribe:

```
/new-module category
```

Claude te guiará para crear un módulo completo.

### Paso 3: Mantén Sincronizado el Esquema DB

Después de cada migración:

```
/update-db-context
```

---

## 📋 Estructura de Archivos Claude

```
fervor-juvenil-back/
├── .claude/
│   ├── commands/              # Comandos slash
│   │   ├── new-module.md
│   │   ├── review-pr.md
│   │   ├── test-module.md
│   │   └── update-db-context.md
│   └── README.md
│
├── context/
│   └── db-structure.sql      # 🎯 Schema de DB (mantener actualizado)
│
├── CLAUDE.md                  # 🎯 Reglas principales del proyecto
├── CLAUDE_USAGE.md            # 📖 Guía de uso completa
└── SETUP_CLAUDE.md            # Este archivo
```

---

## 🔧 Configuración Técnica

### Claude Code lee automáticamente:

1. **CLAUDE.md** - Al inicio de cada conversación
   - No necesitas decir "lee CLAUDE.md"
   - Claude ya conoce las reglas

2. **context/db-structure.sql** - Cuando trabajas con DB
   - Sirve de referencia para queries
   - Ayuda a generar repositorios correctos

3. **src/user/** - Como ejemplo de arquitectura
   - Referencia al crear nuevos módulos
   - Template de estructura hexagonal

### Los comandos slash funcionan:

- ✅ En Claude Code (extensión VSCode)
- ❌ NO en claude.ai (navegador)

---

## 🎓 Reglas Importantes Agregadas a CLAUDE.md

### 1. UUID Version 7
```typescript
// ❌ MAL
@PrimaryGeneratedColumn('uuid')
uuid: string

// ✅ BIEN
@PrimaryColumn('uuid')
uuid: string
```

### 2. Nombres de Columnas
```sql
-- ❌ MAL (español)
nombre_completo VARCHAR(120)
fecha_nacimiento DATE

-- ✅ BIEN (inglés)
full_name VARCHAR(120)
birth_date DATE
```

### 3. Arquitectura Hexagonal
```
src/module/
├── domain/           # Entidades puras
├── application/      # Use cases
├── infrastructure/   # TypeORM, mappers
└── presentation/     # Controllers
```

---

## 📝 Flujo de Trabajo Recomendado

### Para Crear un Nuevo Feature:

```
1. /new-module <nombre>
   ↓
2. [Claude crea todo el módulo]
   ↓
3. [Claude genera migración]
   ↓
4. /update-db-context
   ↓
5. /test-module <nombre>
   ↓
6. /review-pr
   ↓
7. [Crear PR]
```

### Para Modificar DB:

```
1. Modificar schema
   ↓
2. Generar migración
   ↓
3. Ejecutar migración
   ↓
4. /update-db-context
```

---

## 🎯 Próximos Pasos

1. **Lee** `CLAUDE_USAGE.md` completo (10 minutos)
2. **Prueba** crear un módulo de prueba con `/new-module`
3. **Familiarízate** con los comandos disponibles
4. **Mantén** actualizados los archivos de referencia

---

## 💡 Tips Pro

### Tip 1: Contexto Siempre Actualizado
```bash
# Después de CADA migración:
/update-db-context

# Esto asegura que Claude siempre tenga el schema correcto
```

### Tip 2: Usa Comandos para Consistencia
```bash
# En lugar de:
"Crea un módulo product con domain, use cases, controllers..."

# Usa:
/new-module product
```

### Tip 3: Revisa Antes de Commitear
```bash
# Antes de git commit:
/review-pr

# Claude valida:
# - Estándares de código
# - Tests
# - Linting
# - Arquitectura
```

### Tip 4: Referencia el User Module
```bash
# Al pedir cambios, menciona:
"Siguiendo el patrón del módulo user..."
"Como en src/user/..."
```

---

## 🆘 Troubleshooting

### Claude no encuentra un comando slash

**Problema:** Escribo `/my-command` y no funciona

**Solución:**
1. Verifica que el archivo `.claude/commands/my-command.md` existe
2. Reinicia VSCode
3. Verifica que estás usando Claude Code (extensión), no claude.ai

---

### Claude no sigue las convenciones

**Problema:** Claude genera código diferente al estándar

**Solución:**
1. Di: "Sigue las reglas de CLAUDE.md"
2. Menciona: "Como en el módulo user"
3. Verifica que CLAUDE.md esté actualizado

---

### context/db-structure.sql desactualizado

**Problema:** El archivo SQL no refleja las últimas migraciones

**Solución:**
```bash
/update-db-context
```

---

## 📚 Recursos

- **CLAUDE_USAGE.md** - Guía completa de uso
- **CLAUDE.md** - Convenciones técnicas
- **context/db-structure.sql** - Schema de DB
- **src/user/README.md** - Ejemplo de arquitectura

---

## ✨ Resumen

Has configurado un sistema completo para trabajar con Claude Code que incluye:

✅ Archivos de referencia (fuentes de verdad)
✅ Comandos slash personalizados
✅ Estándares de código documentados
✅ Flujos de trabajo optimizados
✅ Documentación completa

**Siguiente paso:** Lee `CLAUDE_USAGE.md` y empieza a usar los comandos!

---

**Creado:** 2025-10-25
**Versión:** 1.0
