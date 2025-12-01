# API Contracts - Feature #5: Gestión de Perfil de Usuario

## Resumen

Esta documentación describe los contratos de API para los endpoints de gestión de perfil de usuario implementados en la Feature #5.

**Base URL**: `http://localhost:3006/api`

**Formato de Respuesta**: Todas las respuestas exitosas siguen el formato `{data: ...}` para consistencia y futura implementación de paginación.

---

## Autenticación

Todos los endpoints requieren autenticación JWT. Debes incluir el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

---

## Endpoints

### 1. Obtener Perfil del Usuario Actual

**GET** `/users/me`

Obtiene la información completa del usuario autenticado, incluyendo sus datos de perfil.

#### Headers
```
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200 OK)

```json
{
  "data": {
    "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "slug": "juan-perez",
    "isGoogleAccount": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T14:45:00.000Z",
    "profile": {
      "uuid": "01936f2b-5678-7890-abcd-ef1234567890",
      "gender": "M",
      "age": 25,
      "birthDate": "1999-05-15T00:00:00.000Z",
      "status": "A",
      "alias": "Juancho",
      "hasUniform": true,
      "shirtSize": "M",
      "pantsSize": "32",
      "shoeSize": "42",
      "heightMeters": 1.75,
      "weightKg": 70.5,
      "healthInsurance": "EsSalud",
      "bloodType": "O+",
      "allergies": null,
      "disabilityOrDisorder": null,
      "enrollmentDate": "2024-03-01T00:00:00.000Z",
      "currentResidence": "Lima, Perú",
      "professionalGoal": "Ingeniero de Software",
      "favoriteHero": "Spider-Man",
      "firstNames": "Juan Carlos",
      "lastNames": "Pérez García",
      "registrationDate": "2024-01-10T00:00:00.000Z"
    }
  }
}
```

#### Respuesta Exitosa con Perfil No Creado (200 OK)

```json
{
  "data": {
    "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
    "firstName": "María",
    "lastName": "López",
    "email": "maria.lopez@example.com",
    "slug": "maria-lopez",
    "isGoogleAccount": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "profile": null
  }
}
```

#### Errores

**401 Unauthorized** - Token no válido o ausente
```json
{
  "statusCode": 401,
  "message": "Debe iniciar sesión"
}
```

**404 Not Found** - Usuario no existe (caso raro, solo si fue eliminado)
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```

---

### 2. Actualizar Perfil del Usuario Actual

**PUT** `/users/me`

Actualiza la información del usuario autenticado. Puede actualizar tanto datos básicos (nombre, email) como datos del perfil. Si el perfil no existe, se crea automáticamente.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

Todos los campos son opcionales. Solo envía los campos que deseas actualizar.

```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "email": "nuevo.email@example.com",
  "gender": "M",
  "age": 26,
  "birthDate": "1999-05-15",
  "status": "A",
  "alias": "JC",
  "hasUniform": true,
  "shirtSize": "L",
  "pantsSize": "34",
  "shoeSize": "43",
  "heightMeters": 1.76,
  "weightKg": 72.0,
  "healthInsurance": "Pacífico Seguros",
  "bloodType": "O+",
  "allergies": "Polen",
  "disabilityOrDisorder": null,
  "enrollmentDate": "2024-03-01",
  "currentResidence": "San Isidro, Lima",
  "professionalGoal": "Senior Software Engineer",
  "favoriteHero": "Iron Man",
  "firstNames": "Juan Carlos",
  "lastNames": "Pérez García",
  "registrationDate": "2024-01-10"
}
```

#### Ejemplo: Solo actualizar tallas

```json
{
  "shirtSize": "XL",
  "pantsSize": "36",
  "shoeSize": "44"
}
```

#### Respuesta Exitosa (200 OK)

```json
{
  "message": "Perfil actualizado exitosamente",
  "data": {
    "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "email": "nuevo.email@example.com",
    "slug": "juan-carlos-perez-garcia",
    "isGoogleAccount": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T15:30:00.000Z",
    "profile": {
      "uuid": "01936f2b-5678-7890-abcd-ef1234567890",
      "gender": "M",
      "age": 26,
      "birthDate": "1999-05-15T00:00:00.000Z",
      "status": "A",
      "alias": "JC",
      "hasUniform": true,
      "shirtSize": "XL",
      "pantsSize": "36",
      "shoeSize": "44",
      "heightMeters": 1.76,
      "weightKg": 72.0,
      "healthInsurance": "Pacífico Seguros",
      "bloodType": "O+",
      "allergies": "Polen",
      "disabilityOrDisorder": null,
      "enrollmentDate": "2024-03-01T00:00:00.000Z",
      "currentResidence": "San Isidro, Lima",
      "professionalGoal": "Senior Software Engineer",
      "favoriteHero": "Iron Man",
      "firstNames": "Juan Carlos",
      "lastNames": "Pérez García",
      "registrationDate": "2024-01-10T00:00:00.000Z"
    }
  }
}
```

#### Errores

**400 Bad Request** - Datos de validación inválidos
```json
{
  "statusCode": 400,
  "message": [
    "Edad debe ser mayor o igual a 0",
    "Email debe tener un formato válido"
  ],
  "error": "Bad Request"
}
```

**401 Unauthorized** - Token no válido
```json
{
  "statusCode": 401,
  "message": "Debe iniciar sesión"
}
```

**404 Not Found** - Usuario no existe
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```

---

### 3. Listar Todos los Usuarios (Admin/Superadmin)

**GET** `/users`

Lista todos los usuarios del sistema con sus perfiles. **Solo accesible para usuarios con rol admin o superadmin**.

#### Headers
```
Authorization: Bearer <token_admin>
```

#### Respuesta Exitosa (200 OK)

```json
{
  "data": [
    {
      "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "slug": "juan-perez",
      "isGoogleAccount": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-20T14:45:00.000Z",
      "profile": {
        "uuid": "01936f2b-5678-7890-abcd-ef1234567890",
        "gender": "M",
        "age": 25,
        "birthDate": "1999-05-15T00:00:00.000Z",
        "status": "A",
        "shirtSize": "M",
        "pantsSize": "32",
        "shoeSize": "42"
      }
    },
    {
      "uuid": "01936f2c-9999-7890-abcd-ef1234567890",
      "firstName": "María",
      "lastName": "López",
      "email": "maria.lopez@example.com",
      "slug": "maria-lopez",
      "isGoogleAccount": false,
      "createdAt": "2025-01-16T11:00:00.000Z",
      "updatedAt": "2025-01-16T11:00:00.000Z",
      "profile": null
    }
  ]
}
```

#### Errores

**401 Unauthorized** - Token no válido
```json
{
  "statusCode": 401,
  "message": "Debe iniciar sesión"
}
```

**403 Forbidden** - Usuario no tiene permisos de admin
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para acceder a este recurso"
}
```

---

### 4. Obtener Usuario Específico por UUID (Admin/Superadmin)

**GET** `/users/:uuid`

Obtiene un usuario específico por su UUID con su perfil. **Solo accesible para usuarios con rol admin o superadmin**.

#### Headers
```
Authorization: Bearer <token_admin>
```

#### Parámetros URL
- `uuid` (string, requerido): UUID del usuario a buscar

#### Ejemplo
```
GET /api/users/01936f2a-1234-7890-abcd-ef1234567890
```

#### Respuesta Exitosa (200 OK)

```json
{
  "data": {
    "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "slug": "juan-perez",
    "isGoogleAccount": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T14:45:00.000Z",
    "profile": {
      "uuid": "01936f2b-5678-7890-abcd-ef1234567890",
      "gender": "M",
      "age": 25,
      "birthDate": "1999-05-15T00:00:00.000Z",
      "status": "A",
      "alias": "Juancho",
      "hasUniform": true,
      "shirtSize": "M",
      "pantsSize": "32",
      "shoeSize": "42",
      "heightMeters": 1.75,
      "weightKg": 70.5,
      "healthInsurance": "EsSalud",
      "bloodType": "O+",
      "allergies": null,
      "disabilityOrDisorder": null,
      "enrollmentDate": "2024-03-01T00:00:00.000Z",
      "currentResidence": "Lima, Perú",
      "professionalGoal": "Ingeniero de Software",
      "favoriteHero": "Spider-Man",
      "firstNames": "Juan Carlos",
      "lastNames": "Pérez García",
      "registrationDate": "2024-01-10T00:00:00.000Z"
    }
  }
}
```

#### Errores

**401 Unauthorized** - Token no válido
```json
{
  "statusCode": 401,
  "message": "Debe iniciar sesión"
}
```

**403 Forbidden** - Usuario no tiene permisos de admin
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para acceder a este recurso"
}
```

**404 Not Found** - Usuario no encontrado
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```

---

## Tipos de Datos

### UserProfile Fields

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `uuid` | string (UUID v7) | Sí (auto) | Identificador único del perfil |
| `gender` | string | No | "M" o "F" |
| `age` | number | No | Edad del usuario (0-150) |
| `birthDate` | string (ISO 8601) | No | Fecha de nacimiento |
| `status` | string | No | "A" (Activo) o "I" (Inactivo) |
| `alias` | string | No | Apodo o alias (máx 80 caracteres) |
| `hasUniform` | boolean | No | Si tiene uniforme |
| `shirtSize` | string | No | Talla de camisa (máx 5 caracteres) |
| `pantsSize` | string | No | Talla de pantalón (máx 5 caracteres) |
| `shoeSize` | string | No | Talla de zapato (máx 5 caracteres) |
| `heightMeters` | number | No | Altura en metros (0-3) |
| `weightKg` | number | No | Peso en kilogramos (0-500) |
| `healthInsurance` | string | No | Seguro de salud (máx 50 caracteres) |
| `bloodType` | string | No | Tipo de sangre |
| `allergies` | string | No | Alergias |
| `disabilityOrDisorder` | string | No | Discapacidad o trastorno |
| `enrollmentDate` | string (ISO 8601) | No | Fecha de inscripción |
| `currentResidence` | string | No | Residencia actual (máx 120 caracteres) |
| `professionalGoal` | string | No | Meta profesional (máx 120 caracteres) |
| `favoriteHero` | string | No | Superhéroe favorito (máx 120 caracteres) |
| `firstNames` | string | No | Nombres completos (máx 120 caracteres) |
| `lastNames` | string | No | Apellidos completos (máx 120 caracteres) |
| `registrationDate` | string (ISO 8601) | No | Fecha de registro |

---

## Ejemplos de Uso con cURL

### Obtener perfil actual

```bash
curl -X GET http://localhost:3006/api/users/me \
  -H "Authorization: Bearer tu_token_jwt"
```

### Actualizar perfil

```bash
curl -X PUT http://localhost:3006/api/users/me \
  -H "Authorization: Bearer tu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "age": 26,
    "shirtSize": "L"
  }'
```

### Listar todos los usuarios (admin)

```bash
curl -X GET http://localhost:3006/api/users \
  -H "Authorization: Bearer token_admin"
```

### Obtener usuario por UUID (admin)

```bash
curl -X GET http://localhost:3006/api/users/01936f2a-1234-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer token_admin"
```

---

## Notas para Frontend

1. **Formato de Respuesta Estándar**:
   - Todas las respuestas exitosas vienen en formato `{data: ...}`
   - Para un solo objeto: `{data: {objeto}}`
   - Para arrays: `{data: [array]}`
   - En el futuro se agregará paginación: `{data: [...], pagination: {...}}`

2. **Tokens JWT**: Guarda el token después del login y envíalo en cada petición mediante el header `Authorization: Bearer <token>`.

3. **Manejo de Perfil Nulo**: El campo `profile` puede ser `null` si el usuario no ha creado su perfil aún. Muestra un mensaje apropiado pidiendo completar el perfil.

4. **Validaciones**: Todos los errores de validación vienen en un array bajo la propiedad `message`. Muestra cada error al usuario.

5. **Permisos de Admin**: Los endpoints `/users` (lista) y `/users/:uuid` (detalle) solo funcionan con roles admin/superadmin. Verifica el rol antes de mostrar estas opciones en el UI.

6. **Actualización Parcial**: En PUT `/users/me`, envía solo los campos que cambiaron. No es necesario enviar todo el objeto.

7. **Formato de Fechas**: Las fechas vienen en formato ISO 8601 (UTC). Convierte a timezone local para mostrar al usuario.

8. **UUIDs v7**: Los UUIDs son de versión 7, ordenables temporalmente. Puedes usarlos para ordenación si es necesario.

9. **Mensajes en Español**: Todos los mensajes de error y respuesta están en español para mejor UX.

10. **Acceso a Datos**:
    ```javascript
    // Obtener perfil
    const response = await fetch('/api/users/me', {headers: {Authorization: `Bearer ${token}`}})
    const {data} = await response.json()
    console.log(data.firstName, data.profile?.age)

    // Listar usuarios (admin)
    const response = await fetch('/api/users', {headers: {Authorization: `Bearer ${token}`}})
    const {data} = await response.json() // data es un array
    data.forEach(user => console.log(user.email))
    ```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 400 | Datos de entrada inválidos |
| 401 | No autenticado (token ausente o inválido) |
| 403 | No autorizado (sin permisos para la operación) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
