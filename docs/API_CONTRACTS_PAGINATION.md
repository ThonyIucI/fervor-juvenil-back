# API Contracts - Paginación de Usuarios

## Resumen

Esta documentación describe el contrato API para el endpoint de listado paginado de usuarios con filtros, búsqueda y ordenamiento.

**Base URL**: `http://localhost:3006/api`

---

## Autenticación

Este endpoint requiere autenticación JWT con rol de admin o superadmin. Debes incluir el token en el header:

```
Authorization: Bearer <tu_token_jwt_admin>
```

---

## Endpoint

### Listar Usuarios Paginados (Admin/Superadmin)

**GET** `/users`

Lista todos los usuarios del sistema con sus perfiles de forma paginada. Incluye capacidades de:
- **Paginación**: Controla la página y cantidad de resultados
- **Ordenamiento**: Por diferentes campos (nombre, apellido, email, fecha de creación, estado activo)
- **Filtros**: Por estado activo/inactivo
- **Búsqueda**: Por nombre, apellido o email

#### Headers
```
Authorization: Bearer <token_admin>
```

#### Query Parameters

Todos los parámetros son opcionales. Si no se especifican, se usan los valores por defecto.

| Parámetro | Tipo | Requerido | Por Defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `page` | number | No | `1` | Número de página (mínimo 1) |
| `limit` | number | No | `10` | Cantidad de resultados por página (1-100) |
| `sortBy` | string | No | `lastName` | Campo por el cual ordenar |
| `sortOrder` | string | No | `ASC` | Orden ascendente (`ASC`) o descendente (`DESC`) |
| `isActive` | boolean | No | - | Filtrar por usuarios activos/inactivos |
| `search` | string | No | - | Buscar en nombre, apellido o email |

##### Valores válidos para `sortBy`:
- `firstName` - Ordenar por nombre
- `lastName` - Ordenar por apellido (por defecto)
- `email` - Ordenar por email
- `createdAt` - Ordenar por fecha de creación
- `isActive` - Ordenar por estado activo

#### Ejemplos de Uso

##### 1. Listado básico (primera página, 10 resultados)
```
GET /api/users
```

##### 2. Segunda página con 20 resultados
```
GET /api/users?page=2&limit=20
```

##### 3. Ordenar por email descendente
```
GET /api/users?sortBy=email&sortOrder=DESC
```

##### 4. Filtrar solo usuarios activos
```
GET /api/users?isActive=true
```

##### 5. Buscar usuarios por nombre
```
GET /api/users?search=Juan
```

##### 6. Combinando múltiples filtros
```
GET /api/users?page=1&limit=15&sortBy=lastName&sortOrder=ASC&isActive=true&search=García
```

---

## Respuestas

### Respuesta Exitosa (200 OK)

La respuesta incluye dos propiedades principales:
- `data`: Array de usuarios con información limitada del perfil
- `meta`: Metadata de paginación

```json
{
  "data": [
    {
      "uuid": "01936f2a-1234-7890-abcd-ef1234567890",
      "firstName": "Juan",
      "lastName": "García",
      "email": "juan.garcia@example.com",
      "slug": "juan-garcia",
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
    },
    {
      "uuid": "01936f2d-8888-7890-abcd-ef1234567890",
      "firstName": "Pedro",
      "lastName": "Martínez",
      "email": "pedro.martinez@example.com",
      "slug": "pedro-martinez",
      "isGoogleAccount": true,
      "createdAt": "2025-01-17T09:15:00.000Z",
      "updatedAt": "2025-01-17T09:15:00.000Z",
      "profile": {
        "uuid": "01936f2e-7777-7890-abcd-ef1234567890",
        "gender": "M",
        "age": 30,
        "birthDate": "1994-08-20T00:00:00.000Z",
        "status": "A",
        "shirtSize": "L",
        "pantsSize": "34",
        "shoeSize": "43"
      }
    }
  ],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Respuesta con Búsqueda Sin Resultados (200 OK)

```json
{
  "data": [],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## Metadata de Paginación

El objeto `meta` contiene información útil para implementar la interfaz de paginación:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `currentPage` | number | Página actual solicitada |
| `itemsPerPage` | number | Cantidad de items por página (límite usado) |
| `totalItems` | number | Cantidad total de items que coinciden con los filtros |
| `totalPages` | number | Cantidad total de páginas disponibles |
| `hasNextPage` | boolean | `true` si hay más páginas después de la actual |
| `hasPreviousPage` | boolean | `true` si hay páginas anteriores |

---

## Estructura del Perfil en Listados

En el endpoint de listado, el perfil incluye **solo información básica** para optimizar la respuesta:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | string | ID único del perfil |
| `gender` | string \| null | Género: "M" o "F" |
| `age` | number \| null | Edad del usuario |
| `birthDate` | string \| null | Fecha de nacimiento (ISO 8601) |
| `status` | string \| null | Estado: "A" (Activo) o "I" (Inactivo) |
| `shirtSize` | string \| null | Talla de camisa |
| `pantsSize` | string \| null | Talla de pantalón |
| `shoeSize` | string \| null | Talla de zapato |

**Nota**: Para obtener todos los detalles del perfil, usa el endpoint `GET /users/:uuid` con el UUID del usuario.

---

## Errores

### 400 Bad Request - Parámetros inválidos
```json
{
  "statusCode": 400,
  "message": [
    "La página debe ser al menos 1",
    "El límite no puede ser mayor a 100"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized - Token no válido
```json
{
  "statusCode": 401,
  "message": "Debe iniciar sesión"
}
```

### 403 Forbidden - Sin permisos de admin
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para acceder a este recurso"
}
```

---

## Comportamiento por Defecto

**Ordenamiento Inteligente**:
- Por defecto, los usuarios **activos aparecen primero**, seguidos de los inactivos
- Dentro de cada grupo, se ordenan por apellido (`lastName`) en orden ascendente
- Este comportamiento se aplica automáticamente a menos que uses el filtro `isActive`

**Ejemplo del orden por defecto**:
1. Usuarios activos ordenados por apellido A-Z
2. Usuarios inactivos ordenados por apellido A-Z

Si filtras por `isActive=true`, solo verás usuarios activos y no se aplicará el ordenamiento automático por estado.

---

## Ejemplos de Uso con JavaScript/TypeScript

### 1. Fetch Básico

```typescript
async function getUsers(page = 1, limit = 10) {
  const response = await fetch(
    `http://localhost:3006/api/users?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  const result = await response.json()
  return result
}

// Uso
const { data: users, meta } = await getUsers(1, 20)
console.log(`Mostrando ${users.length} de ${meta.totalItems} usuarios`)
```

### 2. Con Filtros y Búsqueda

```typescript
interface GetUsersParams {
  page?: number
  limit?: number
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'isActive'
  sortOrder?: 'ASC' | 'DESC'
  isActive?: boolean
  search?: string
}

async function getUsers(params: GetUsersParams = {}) {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
  if (params.search) queryParams.append('search', params.search)

  const response = await fetch(
    `http://localhost:3006/api/users?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  return await response.json()
}

// Ejemplos de uso
const result1 = await getUsers({ page: 2, limit: 20 })
const result2 = await getUsers({ isActive: true, sortBy: 'lastName' })
const result3 = await getUsers({ search: 'García', sortOrder: 'DESC' })
```

### 3. Componente React con Paginación

```tsx
import { useState, useEffect } from 'react'

function UsersList() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  async function fetchUsers() {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...(search && { search })
    })

    const response = await fetch(`/api/users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    const { data, meta } = await response.json()
    setUsers(data)
    setMeta(meta)
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1) // Reset a primera página al buscar
        }}
      />

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uuid}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.isActive ? 'Activo' : 'Inactivo'}</td>
              <td>
                {user.profile ? (
                  <span>
                    {user.profile.age} años -
                    Talla: {user.profile.shirtSize || 'N/A'}
                  </span>
                ) : (
                  <span>Sin perfil</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div className="pagination">
          <button
            disabled={!meta.hasPreviousPage}
            onClick={() => setPage(p => p - 1)}
          >
            Anterior
          </button>

          <span>
            Página {meta.currentPage} de {meta.totalPages}
            ({meta.totalItems} usuarios)
          </span>

          <button
            disabled={!meta.hasNextPage}
            onClick={() => setPage(p => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## Ejemplos con cURL

### Listado básico
```bash
curl -X GET "http://localhost:3006/api/users" \
  -H "Authorization: Bearer tu_token_admin"
```

### Con paginación
```bash
curl -X GET "http://localhost:3006/api/users?page=2&limit=15" \
  -H "Authorization: Bearer tu_token_admin"
```

### Buscar y filtrar
```bash
curl -X GET "http://localhost:3006/api/users?search=García&isActive=true&sortBy=lastName&sortOrder=ASC" \
  -H "Authorization: Bearer tu_token_admin"
```

---

## Notas Importantes para Frontend

1. **Optimización**: El endpoint de listado devuelve solo campos básicos del perfil. Para detalles completos, usa `GET /users/:uuid`

2. **Búsqueda en Tiempo Real**: La búsqueda es case-insensitive y busca coincidencias parciales en nombre, apellido y email

3. **Límites**: El máximo de resultados por página es 100. Si solicitas más, recibirás un error de validación

4. **Páginas Vacías**: Si solicitas una página que no existe (ej: página 100 cuando solo hay 5 páginas), recibirás un array vacío pero con status 200

5. **Performance**: Usa `limit` pequeños (10-25) para listados con scroll infinito, y límites mayores (50-100) para tablas con paginación clásica

6. **Cache**: Considera implementar cache en el frontend para páginas ya visitadas

7. **URL State**: Guarda los parámetros de búsqueda/filtro en la URL para que usuarios puedan compartir enlaces filtrados

8. **Perfil Null**: Siempre verifica si `profile` es `null` antes de acceder a sus propiedades

9. **Ordenamiento Múltiple**: El backend siempre prioriza usuarios activos primero (a menos que uses `isActive` como filtro)

10. **TypeScript**: Usa las interfaces provistas para type-safety en tu aplicación

---

## Interfaces TypeScript para Frontend

```typescript
// Metadata de paginación
interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Perfil limitado en listados
interface UserProfileListItem {
  uuid: string
  gender: string | null
  age: number | null
  birthDate: string | null
  status: string | null
  shirtSize: string | null
  pantsSize: string | null
  shoeSize: string | null
}

// Usuario en listado
interface UserListItem {
  uuid: string
  firstName: string
  lastName: string
  email: string
  slug: string
  isGoogleAccount: boolean
  createdAt: string
  updatedAt: string
  profile: UserProfileListItem | null
}

// Respuesta completa del endpoint
interface PaginatedUsersResponse {
  data: UserListItem[]
  meta: PaginationMeta
}

// Parámetros de consulta
interface GetUsersQueryParams {
  page?: number
  limit?: number
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'isActive'
  sortOrder?: 'ASC' | 'DESC'
  isActive?: boolean
  search?: string
}
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa (incluso con array vacío) |
| 400 | Parámetros de query inválidos |
| 401 | No autenticado (token ausente o inválido) |
| 403 | No autorizado (sin rol de admin/superadmin) |
| 500 | Error interno del servidor |

---

## Changelog

- **v1.0.0** (2025-01-28): Implementación inicial de paginación con filtros, búsqueda y ordenamiento
