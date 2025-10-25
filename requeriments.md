# 1 Feature: Migraciones de base de datos

Scenario: Crear estructura de base de datos correctamente
  Given que ejecuto las migraciones del proyecto
  When se completan todas las migraciones sin errores
  Then deben existir las tablas "users", "user_profiles", "guardians", "roles" y "user_roles"
  And las relaciones entre usuarios y perfiles deben estar correctamente definidas
  And el campo "email" en la tabla "users" debe ser único

# 2 Feature: Importación de datos desde archivo CSV o Excel

Scenario: Importar usuarios y perfiles desde archivo válido
  Given que tengo un archivo CSV válido con datos de usuarios
  When ejecuto el proceso de importación
  Then se deben crear los registros en las tablas "users" y "user_profiles"
  And los datos deben corresponder a los campos indicados
  And los errores de formato deben registrarse en un log sin interrumpir la importación

Scenario: Crear superadministrador por defecto
  Given que ejecuto el seeder inicial
  When se crean los datos por defecto
  Then debe existir un usuario con el email "afffervorjuvenil@gmail.com" con rol "superadmin"

# 3 Feature: Login y autenticación de usuarios

Scenario: Iniciar sesión correctamente
  Given que el usuario existe y su contraseña inicial es su DNI
  When intenta iniciar sesión con su email y su DNI
  Then el sistema debe permitir el acceso y generar un token o sesión válida

Scenario: Contraseña incorrecta
  Given que el usuario existe
  When ingresa una contraseña incorrecta
  Then el sistema debe rechazar el acceso con un mensaje de error seguro

Scenario: Cambiar contraseña después del primer ingreso
  Given que el usuario ha iniciado sesión por primera vez
  When solicita cambiar su contraseña
  Then el sistema debe actualizarla y almacenar el hash de forma segura

Scenario: Almacenamiento seguro de contraseñas
  Given que existen usuarios registrados
  When reviso la base de datos
  Then las contraseñas no deben estar almacenadas en texto plano

# 4 Feature: Control de roles y permisos

Scenario: Asignar roles correctamente
  Given que existe un usuario
  When un superadministrador le asigna un rol
  Then el usuario debe tener los permisos correspondientes a ese rol

Scenario: Acceso restringido a usuarios comunes
  Given que un usuario tiene rol "user"
  When intenta acceder al listado general de usuarios
  Then el sistema debe denegar el acceso

Scenario: Acceso permitido a administradores
  Given que un usuario tiene rol "admin" o "superadmin"
  When accede al listado de usuarios
  Then el sistema debe mostrar todos los registros

Scenario: Correo especial con permisos completos
  Given que el usuario tiene el correo "afffervorjuvenil@gmail.com"
  When accede a la aplicación
  Then debe tener acceso completo como superadministrador


# 5 Feature: Visualización y edición del perfil

Scenario: Ver perfil propio
  Given que un usuario ha iniciado sesión
  When accede a su perfil
  Then el sistema debe mostrar su información personal agrupada por secciones

Scenario: Editar perfil propio
  Given que el usuario ha iniciado sesión
  When edita campos permitidos como teléfono o alias
  Then el sistema debe guardar los cambios correctamente

Scenario: Privacidad de datos
  Given que un usuario está autenticado
  When intenta ver el perfil de otro usuario sin permisos
  Then el sistema debe denegar el acceso a los datos

Scenario: Mostrar secciones del perfil
  Given que el perfil del usuario tiene datos completos
  When el usuario abre su perfil
  Then debe ver secciones de datos personales, contacto, salud, tallas, apoderado y datos adicionales

 # 6 Feature: Dashboard de usuarios

Scenario: Acceso de administradores al listado general
  Given que el usuario tiene rol "admin" o "superadmin"
  When accede al dashboard
  Then debe ver el listado completo de usuarios con nombre, correo y rol

Scenario: Acceso de usuario normal al dashboard
  Given que el usuario tiene rol "user"
  When inicia sesión
  Then debe ser dirigido directamente a la vista de su perfil

Scenario: Búsqueda en el listado
  Given que el usuario es administrador
  When realiza una búsqueda por nombre o DNI
  Then el sistema debe mostrar solo los resultados coincidentes

 # 7 Feature: Protección de datos y seguridad

Scenario: No exponer datos sensibles
  Given que un usuario realiza una petición a la API
  When el sistema responde con los datos de un perfil
  Then los campos sensibles como DNI o tipo de sangre no deben exponerse en listados públicos

Scenario: Sesiones seguras
  Given que el usuario está autenticado
  When realiza acciones dentro de la aplicación
  Then su sesión debe ser validada mediante un token o cookie segura
