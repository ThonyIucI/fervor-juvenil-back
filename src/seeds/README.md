# Seeds - Importación de Datos

Módulo para importar datos iniciales desde archivos CSV.

## Uso

### 1. Importar usuarios desde CSV

```bash
npm run seed:csv [ruta-al-archivo.csv]
```

Si no especificas la ruta, usa `data.csv` por defecto en la raíz del proyecto.

**Ejemplo:**
```bash
npm run seed:csv data.csv
```

### 2. Qué hace el comando

1. **Crea roles** (si no existen):
   - `superadmin` - Super administrador con acceso completo
   - `admin` - Administrador con acceso limitado
   - `user` - Usuario regular

2. **Crea superadmin** (si no existe):
   - Email: `affervorjuvenil@gmail.com`
   - Password: `admin123` (cambiar después del primer login)
   - Rol: `superadmin`

3. **Importa usuarios desde CSV**:
   - Crea usuario con email, DNI, nombres y apellidos
   - Password inicial: **DNI del usuario** (hasheado con bcrypt)
   - Crea perfil con todos los datos del CSV
   - Crea apoderados (principal y secundario)
   - Asigna rol `user` por defecto

### 3. Formato del CSV

El CSV debe tener las siguientes columnas (en español):

#### Datos de Usuario
- `Email Address` - **Requerido**
- `N° de DNI` - **Requerido** (se usa como password inicial)
- `Nombres completos` - **Requerido**
- `Apellidos completos` - **Requerido**

#### Datos de Perfil
- `Género` - M/F
- `Edad` - Número
- `Fecha de nacimiento` - MM/DD/YYYY
- `Estado` - A (Activo) / I (Inactivo)
- `Alias (nombre con el que se te conoce normalmente)`
- `Tiene polo` - Sí/No
- `Talla de polo (se considera talla completa)` - S/M/L/XL/XXL
- `Talla de pantalón`
- `Talla de zapato`
- `Talla (en metros, por ejemplo: 1.67)` - Altura en metros
- `Peso (en kg, por ejemplo: 58)` - Peso en kilogramos
- `Seguro de Salud` - SIS/ESSALUD/Otro
- `Tipo de sangre` - A+/A-/B+/B-/AB+/AB-/O+/O-
- `Elementos a los que es alérgico (alimentos, medicamentos, etc.)`
- `Discapacidad, molestia física, transtorno psicológico diagnosticado`
- `Fecha de inscripción (tome como referencia el primer día de ensayo)` - MM/DD/YYYY
- `Residencia actual (lugar en el que vive actualmente)`
- `Qué quiere ser después de terminar el colegio (médico, arquitecto, etc.)`
- `Superhéroe o superheroína favorito(a)`

#### Datos de Apoderados
- `Nombres y apellidos completos de apoderado (a)`
- `Número de celular de apoderado (a)`
- `Correo electrónico del apoderado (a)`
- `Nombre adicional de adulto encargado en caso no esté el apoderado` - Apoderado secundario
- `Número de celular adicional` - Teléfono del apoderado secundario

### 4. Comportamiento del Import

✅ **Importa usuarios nuevos**
- Crea registro en `users`
- Crea registro en `user_profiles`
- Crea registros en `guardians` (hasta 2: principal y secundario)
- Asigna rol `user`

⚠️ **Salta usuarios existentes**
- Si el email ya existe, no importa el usuario
- Esto previene duplicados

❌ **Manejo de errores**
- Los errores se registran en un log
- La importación continúa con los siguientes registros
- Al final muestra resumen con errores

### 5. Output del Comando

```
🚀 Iniciando importación de datos...

📝 Creando roles...
   ✓ Rol "superadmin" creado
   ✓ Rol "admin" creado
   ✓ Rol "user" creado

👤 Creando superadmin...
   ✓ Superadmin creado: affervorjuvenil@gmail.com

📊 Importando usuarios desde: data.csv
   ✓ Fila 2: Usuario thonyiuci@gmail.com importado exitosamente
   ✓ Fila 3: Usuario zegarraalvarez@gmail.com importado exitosamente
   ...

✅ Importación completada!
   • Importados: 70
   • Saltados: 5
   • Errores: 2

⚠️  Detalles de errores:
   Fila 15 (usuario@example.com): Email ya existe
   Fila 32 (otro@example.com): DNI inválido
```

### 6. Credenciales de Acceso

Después de la importación, los usuarios pueden hacer login con:

- **Email**: El que aparece en el CSV
- **Password**: Su DNI (número de documento)

**Ejemplo:**
- Email: `thonyiuci@gmail.com`
- Password: `75804269`

**Importante**: Los usuarios deben cambiar su contraseña después del primer login.

### 7. Testing

Ejecutar tests del servicio:

```bash
npm test src/seeds/csv-import.service.spec.ts
```

## Arquitectura

### Archivos

- `csv-import.service.ts` - Lógica de importación
- `seed.command.ts` - Comando CLI
- `seeds.module.ts` - Módulo NestJS
- `csv-import.service.spec.ts` - Tests unitarios

### Dependencias

- `csv-parse` - Parser de CSV
- `uuid` - Generación de UUID v7
- `bcrypt` - Hash de contraseñas
- TypeORM - ORM para base de datos

## Troubleshooting

### Error: "Cannot find module csv-parse"

```bash
npm install csv-parse uuid
```

### Error: "Role 'user' not found"

Ejecuta las migraciones primero:

```bash
npm run m:run-dev
```

### Error: "Connection refused"

Verifica que la base de datos esté corriendo:

```bash
# Si usas Docker
docker compose -f compose.local.yaml up -d
```

### Usuarios no se importan (todos saltados)

Los emails ya existen en la base de datos. Para reimportar:

1. Elimina los usuarios existentes desde la base de datos, o
2. Usa un CSV con emails diferentes

## Notas

- El CSV debe estar en formato UTF-8 con BOM
- Los campos vacíos se guardan como `null` en la base de datos
- Los teléfonos pueden tener hasta 50 caracteres (incluye espacios y caracteres especiales)
- Las fechas deben estar en formato MM/DD/YYYY (formato del formulario de Google)
