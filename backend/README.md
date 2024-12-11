# Gestion de usuario en un sistema de salud seguro

## pasos
Lo que primero he realizado es inicializar el subporyecto en este caso para el lado del server.

La confuracion es de manera global es por ello que se hace uso de un sistema de _workspaces_ para poder gestionar ambos subproyectos

los comandos iniciales son:

```shell

# Crear directorio del proyecto
mkdir healthcare-platform
cd healthcare-platform

# Inicializar proyecto Node.js
npm init -y

# Crear estructura de directorios
mkdir -p src/{config,controllers,middleware,models,routes,services,utils} tests/{unit,integration}
```
La estructura de mis directoriso inicial en la tiene la siguiente relevancia

### Dependencias
Dentro de mi proyecto tengo diferentes dependencias  ne las que se ha trabajado con tipos. Es por ello que mi package.json tiene la siguiente estructura:

```json
{
  "name": "healthcare-platform",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev -r tsconfig-paths/register src/server.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.4.1",
    "faker-js": "^1.0.0",
    "helmet": "^8.0.0",
    "ioredis": "^5.4.1",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "module-alias": "^2.2.3",
    "pg": "^8.13.1",
    "redis": "^4.7.0",
    "winston": "^3.17.0"
  },
  "devDependencies": {
    "@faker-js/faker": "^9.3.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/faker": "^6.6.11",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/morgan": "^1.9.9",
    "@types/pg": "^8.11.10",
    "@types/supertest": "^6.0.2",
    "compression": "^1.7.5",
    "faker": "^5.5.3",
    "jest": "^29.7.0",
    "morgan": "^1.10.0",
    "nodemon": "^3.1.7",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "tsconfig-paths": "^4.2.0"
  },
  "_moduleAliases": {
    "@": "dist",
    "@config": "dist/config",
    "@controllers": "dist/controllers",
    "@middleware": "dist/middleware",
    "@models": "dist/models",
    "@routes": "dist/routes",
    "@services": "dist/services",
    "@utils": "dist/utils",
    "@types": "dist/types"
  }
}

```

para ello tenemos que instalar las dependencias necesarias

```shell
# para ello se bene inicializar el poryecto anterimente para obtener mi package.json
npm init --y
## Cambiar la estructura pro el json anterior y ejecutar
npm install
# de este modo inicializamos con nuestros modulo y dependencias
#####
# ahora configuramos nuestro entorno noo confuguracion de tsconfig

tsc --init

```

> tener  en cuenta que la configuracion de mi entorno esta
> en la ruta raiz como tsconfig.ts
> [file_config](tsconfig.json)
>

Este es principalmente para el lado del backend en el que se ha trabjado con tipos o _types_ y rutas estaticas. precisamente para tener una mejor estructura dentro de mi codigo.


Luego esta lo realacionado con mi variables de entorno globales en las que he configurado preiamente como una buena practica.

```env

# Configuración del servidor
NODE_ENV=development
PORT=3000

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password

# Configuración de JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Configuración de Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Configuración de Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Configuración de logging
LOG_LEVEL=debug

```
y aqui estructuro lo que es lo relacionado con mis puertos y variables globales.


### Estrategia planteada

La implementación seguirá estos principios y patrones:
a) Arquitectura en Capas:

- `Controllers`: Manejan las peticiones HTTP y respuestas
- `Services`: Contienen la lógica de negocio
- `Models`: Representan la estructura de datos y operaciones de base de datos
- `Routes`: Definen los endpoints de la API
- `Middleware`: Procesan las peticiones antes de llegar a los controllers

b) Seguridad:

- Implementación de JWT para autenticación
- RBAC para control de acceso
- Rate limiting para prevenir ataques de fuerza bruta
- Encriptación de datos sensibles
- Validación de datos con Joi
- Headers de seguridad con Helmet

c) Optimización:

como propuesta de implementacion esta:

- Caché con Redis para datos frecuentemente accedidos
- Pooling de conexiones a PostgreSQL
- Paginación de resultados


Dentro de mis pasos como configuracion primero configure mi entoron o mi server para ello revisar `config` _directory_ en el que esta precisamente mi configuracion y comunicacion con la base de datos postgresql y con el redis precisamente para el manejo de memmoria almacenada en caché. [path](src/config).

### Config
Esta configuración proporciona una base sólida para tu aplicación. Algunos puntos importantes a destacar:

**Patrón Singleton:** Tanto para la base de datos como para Redis, utilizamos el patrón Singleton para asegurar una única instancia de conexión en toda la aplicación.
**Manejo de Errores**: Implementamos un sistema robusto de logging y manejo de errores para ambas conexiones.
**Configuración Tipada:** Todas las configuraciones están tipadas gracias a TypeScript, lo que nos ayuda a prevenir errores en tiempo de desarrollo.
**Constantes Centralizadas:** Todas las constantes están centralizadas en un único archivo para facilitar su mantenimiento.
**Health Checks**: Incluimos métodos de health check tanto para la base de datos como para Redis, útiles para monitoreo y mantenimiento.

### Controllers

**Estructura Base**:

- Creamos un BaseController que implementa el manejo común de respuestas y errores.
- Utilizamos tipos genéricos para asegurar respuestas tipadas.
- Centralizamos el manejo de errores y el formato de respuesta.


**Tipo de Respuestas:**

- Todas las respuestas siguen una estructura consistente con success, data, message y error.
- Los códigos HTTP se usan apropiadamente (201 para creación, 200 para éxito, 404 para no encontrado, etc.).


**Manejo de Errores:**

- Implementamos manejo específico para errores comunes como validación y duplicados.
- Utilizamos logging para rastrear errores.
- Los errores se transforman en respuestas amigables para el cliente.


**TypeScript Features:**

- Uso de generics para tipado flexible.
- Interfaces para definir la estructura de datos.
- Tipos personalizados para requests con body tipado.


**Principios SOLID:**
- **Open/Closed:** La estructura base permite extensión sin modificación.
- **Dependency Inversion:**Los servicios se inyectan en los controladores.

> Importante dentro de la estructura no se mencionado, pero para complementar estos controladores se hace uso del concepto de _Data Transfer Objects_ (DTOs)
> 


Un ejemplo de como es que están implementado estos controladores

Para el `MedicalHistoryController`:

- Manejo completo de CRUD para historiales médicos
- Funcionalidad especial para adjuntar archivos (attachFile)
- Búsqueda por ID de paciente para obtener todo su historial
- Validación de existencia de registros antes de actualizaciones

Para el `AppointmentController`:

- Gestión completa de citas médicas
- Estados específicos (programada, completada, cancelada)
- Filtros para búsqueda de citas (por fecha, estado)
- Funcionalidades específicas para médicos y pacientes
- Paginación y límites en las consultas

Ambos **controladores**:

- Extienden el `BaseController` existente
- Mantienen el mismo patrón de manejo de errores
- Utilizan tipos TypeScript para mayor seguridad
- Siguen las convenciones de respuesta establecidas


### Middlewares

He implementado tres middleware fundamentales para la seguridad y validación de tu aplicación. Vamos a analizar cada uno:

- `AuthMiddleware` (auth.middleware.ts):

  - Maneja la autenticación mediante JWT.
  - Verifica y decodifica tokens en cada petición.
  - Incluye un mecanismo de renovación automática de tokens próximos a expirar.
  - Adjunta la información del usuario autenticado al objeto Request para su uso posterior.


- `RBACMiddleware` (rbac.middleware.ts):

  - Implementa el Control de Acceso Basado en Roles.
  - Proporciona dos niveles de control de acceso:

      - Verificación de roles permitidos para rutas específicas.
      - Verificación de acceso a recursos específicos (por ejemplo, si un médico puede acceder a un paciente particular).


  - Maneja casos especiales como acceso administrativo.


- `ValidateMiddleware` (validate.middleware.ts):

    - Utiliza Joi para la validación de datos.
    - Proporciona tres tipos de validación:

        - Validación del cuerpo de la petición (body)
        - Validación de parámetros de ruta (params)
        - Validación de parámetros de consulta (query)


    - Devuelve errores detallados y bien estructurados.

> Importante:
> Para complementar esta implementación:
>   - Definir los esquemas de validación Joi en `utils/validation-schemas.ts`
>   - Configurar las constantes de roles y permisos en `config/constants.ts`
> Implementar la lógica específica de verificación de acceso a recursos en `RBACMiddleware`

### Models
La estructura incluye:

1. Modelo Base (base.model.ts):

   - Implementa operaciones CRUD básicas (crear, leer, actualizar, eliminar)
   - Maneja la conexión a la base de datos mediante un pool de conexiones
   - Proporciona manejo de errores y logging consistente
   - Utiliza tipos genéricos para asegurar _type safety_


2. Modelo de Usuario (user.model.ts):

   - Maneja la autenticación y el control de acceso
   - Incluye funciones específicas para gestión de contraseñas y accesos
   - Implementa seguimiento de intentos fallidos de login
   - Gestiona estados de activación y roles


3. Modelo de Paciente (patient.model.ts):

   - Gestiona información demográfica y médica básica
   - Incluye búsqueda por diferentes criterios
   - Maneja tipos especiales como arrays de alergias
   - Implementa validación de email y otros datos de contacto


4. Modelo de Historia Médica (medical-history.model.ts):

   - Maneja registros médicos con relaciones a pacientes y médicos
   - Soporta archivos adjuntos mediante JSONB
   - Implementa consultas específicas por paciente
   - Mantiene un registro temporal de eventos médicos


5. Modelo de Citas (appointment.model.ts):

   - Gestiona programación de citas médicas
   - Incluye verificación de disponibilidad
   - Maneja estados de citas (programada, completada, cancelada)
   - Proporciona consultas por médico y paciente



Cada modelo incluye:

- Tipos TypeScript precisos para todos los campos
- Validación de datos integrada
- Manejo de relaciones entre tablas
- Métodos específicos según los requisitos del negocio
- Logging y manejo de errores consistente

### Rutas / routes

He implementado un sistema completo de rutas con características importantes de seguridad y organización. Vamos a analizar los aspectos clave:

1. Rutas de Autenticación (`auth.routes.ts`):

   * Maneja el registro y login de usuarios
   * No requiere autenticación previa
   * Implementa validación de datos mediante esquemas Joi
   * Punto de entrada para obtener tokens JWT


2. Rutas de Usuarios (user.routes.ts):

   * Gestiona perfiles de usuario
   * Requiere autenticación para todas las operaciones
   * Implementa control de acceso basado en roles
   * Protege operaciones sensibles como eliminación


3. Rutas de Pacientes (patient.routes.ts):

   * Implementa operaciones CRUD completas
   * Incluye validación de datos y parámetros
   * Restringe acceso según roles (médicos y administradores)
   * Soporta paginación y filtros en listados


4. Rutas de Historiales Médicos (medical-history.routes.ts):

   * Maneja registros médicos confidenciales
   * Implementa verificación de acceso a recursos específicos
   * Soporta adjuntos y actualizaciones
   * Restricción por rol de médico


5. Rutas de Citas (appointment.routes.ts):

   * Gestiona programación de citas
   * Implementa validación de fechas y disponibilidad
   * Maneja diferentes estados de citas
   * Incluye permisos específicos por rol

Cada grupo de rutas implementa:

* Autenticación mediante JWT
* Validación de datos de entrada
* Control de acceso basado en roles
* Verificación de acceso a recursos
* Manejo consistente de respuestas
* Documentación clara mediante comentarios

### Services

He implementado una capa de servicios completa que encapsula toda la lógica de negocio de la aplicación. Cada servicio está diseñado para manejar operaciones específicas de manera segura y eficiente. Vamos a analizar las características principales de cada servicio:

1. **AuthService**:
Este servicio maneja toda la lógica relacionada con la autenticación:

   * Registro de usuarios con validación de duplicados
   * Login con manejo de intentos fallidos
   * Generación y gestión de tokens JWT
   * Integración con Redis para blacklisting de tokens
   * Bloqueo automático de cuentas por seguridad


2. **UserService**:
Gestiona las operaciones relacionadas con usuarios:

   * Actualización segura de perfiles
   * Validación de datos únicos como email
   * Manejo de permisos y roles
   * Integración con el sistema de logging


3. **PatientService**:
Maneja toda la lógica relacionada con pacientes:

   * Creación y actualización de registros de pacientes
   * Implementación de caché para mejorar el rendimiento
   * Paginación de resultados
   * Validación de datos únicos
   * Sistema de búsqueda avanzada


4. **MedicalHistoryService**:
Se encarga de los historiales médicos:

   * Creación de registros médicos seguros
   * Validación de permisos de acceso
   * Manejo de archivos adjuntos
   * Búsqueda por paciente
   * Logging de todas las operaciones

5. **AppointmentService**:
Gestiona el sistema de citas:

   * Verificación de disponibilidad
   * Validación de fechas futuras
   * Manejo de estados de citas
   * Transiciones de estado controladas
   * Notificaciones y alertas

esta implementacion es crucial comprender en que parte del ccodigo se implementa cada una de las estrategias plantteadas
 Para ello menccionaré lo relevante de cada fragmento de codigo a menra breve y se repite en algunos casos.

- Manejo de errores:

```ts
try {
    // Operación
} catch (error) {
    logger.error('Error específico:', error);
    throw error;
}
```

- Validaciones de Negocio:

```ts
if (!this.isValidStatusTransition(currentStatus, newStatus)) {
    throw new ValidationError('Transición de estado no permitida');
}
```

- Logging

```ts
logger.info(`Operación exitosa: ${id}`);
```

- Caché:

```ts
const cachedData = await redis.getClient().get(cacheKey);
if (cachedData) {
    return JSON.parse(cachedData);
}
```

### Utils

He implementado un conjunto completo de utilidades que proporcionan funcionalidades esenciales para toda la aplicación. Vamos a analizar cada componente:

1. Logger (logger.ts)
El sistema de logging proporciona:

   * Niveles múltiples de logging (error, warn, info, debug)
   * Rotación automática de archivos de log
   * Formato consistente con timestamps
   * Diferentes configuraciones según el ambiente
   * Patrón Singleton para mantener una única instancia

2. Encryption (encryption.ts)
Maneja toda la seguridad relacionada con contraseñas y datos sensibles:

   * Hash seguro de contraseñas con bcrypt
   * Encriptación de datos sensibles usando AES-256-GCM
   * Métodos para comparar contraseñas de forma segura
   * Manejo de IVs y tags de autenticación

3. Validation Schemas (validation-schemas.ts)
Define esquemas de validación usando Joi para:

   * Registro y login de usuarios
   * Operaciones CRUD de pacientes
   * Historiales médicos
   * Gestión de citas
   * Validaciones específicas para cada tipo de datos

4. Custom Errors (errors.ts)
Proporciona errores personalizados para diferentes situaciones:

   * Errores de validación
   * Errores de autenticación
   * Errores de recursos no encontrados
   * Errores de base de datos

### Types

He creado una estructura completa de tipos TypeScript que cubre todas las necesidades de la aplicación. Vamos a analizar cada parte:

1. Enumeraciones (enums.ts):

   * Define valores constantes utilizados en toda la aplicación
   * Ayuda a prevenir errores de escritura
   * Proporciona autocompletado en el IDE
   * Facilita el mantenimiento al centralizar valores constantes

2. Entidades (entities.ts):

   * Refleja la estructura de las tablas de la base de datos
   * Define tipos base que son extendidos por otras entidades
   * Incluye todos los campos con sus tipos específicos
   * Maneja tipos nulos y opcionales apropiadamente

3. Peticiones (requests.ts):

   * Define la estructura de los datos de entrada
   * Omite campos que no deben ser proporcionados por el cliente
   * Maneja conversiones de tipos (por ejemplo, fechas como strings)
   * Incluye campos opcionales cuando corresponde

4. Respuestas (responses.ts):

   * Establece un formato consistente para todas las respuestas
   * Maneja respuestas paginadas
   * Define respuestas específicas para autenticación
   * Incluye manejo de errores

5. Servicios (services.ts):

   * Define contratos para operaciones CRUD
   * Establece opciones de consulta estándar
   * Proporciona tipos específicos para diferentes servicios
   * Facilita la implementación consistente de servicios

6. Middleware (middleware.ts):

   * Extiende tipos base de Express
   * Añade información de usuario autenticado
   * Maneja tipos para carga de archivos
   * Proporciona type safety en middlewares

##### Los **beneficios** de esta estructura de **tipos** incluyen:
* Seguridad en tiempo de compilación
* Mejor experiencia de desarrollo con autocompletado
* Documentación implícita del código
* Facilidad para mantener la consistencia
* Ayuda a prevenir errores comunes


### DTOs

He creado una estructura completa de DTOs para tu aplicación. Estos DTOs están diseñados para manejar todas las operaciones de creación y actualización de datos.

1. DTOs de Autenticación (auth.dto.ts):

   * `RegisterDTO`: Define los campos necesarios para registrar un nuevo usuario.
   * `LoginDTO`: Simplifica las credenciales necesarias para el inicio de sesión.

2. DTOs de Usuario (user.dto.ts):

   * `UpdateUserDTO`: Permite actualizar cualquier campo del usuario de forma opcional.
   * Incluye manejo de roles y estado activo.


3. DTOs de Paciente (patient.dto.ts):

   * `CreatePatientDTO`: Requiere todos los campos obligatorios para un nuevo paciente.
   * `UpdatePatientDTO`: Permite actualizaciones parciales de la información.


4. DTOs de Historial Médico (medical-history.dto.ts):

   * `CreateMedicalHistoryDTO`: Define la estructura para nuevos registros médicos.
   * `UpdateMedicalHistoryDTO`: Permite modificar diagnósticos y tratamientos.


5. DTOs de Citas (appointment.dto.ts):

   * `CreateAppointmentDTO`: Estructura para programar nuevas citas.
   * `UpdateAppointmentDTO`: Maneja cambios en fechas y estados de citas. 


##### Los DTOs nos ayudan en varios aspectos:

* **Seguridad**:

  * Evitan exponer información sensible innecesariamente
  * Controlan exactamente qué datos se transmiten
* **Rendimiento**:

  * Reducen la cantidad de datos transferidos
  * Optimizan el uso de la red y memoria

* **Validación**:

  * Definen claramente qué datos son requeridos
  * Facilitan la validación de datos de entrada


* **Separación de Preocupaciones:**
  * Separan los datos de la base de datos de los datos de la interfaz
  * Permiten que la estructura interna cambie sin afectar las APIs externas

### Tests

1. **Configuración de Jest:**
    
   - La configuración establece el entorno de pruebas, incluyendo soporte para TypeScript y la estructura de directorios. Utilizamos ts-jest para manejar archivos TypeScript directamente.

2. **Pruebas Unitarias:**
Las pruebas unitarias utilizan datos aleatorios generados con faker para probar componentes de forma aislada. Características principales:

   * Uso de mocks para simular dependencias
   * Datos aleatorios pero realistas usando faker
   * Pruebas de casos positivos y negativos
   * Verificación de comportamiento esperado

3. Pruebas de Integración:
Las pruebas de integración utilizan una base de datos real (pero de prueba) para verificar el funcionamiento del sistema completo. Características:

   * Conexión a base de datos real
   * Limpieza de datos antes de cada prueba
   * Autenticación y autorización
   * Verificación de flujos completos

4. Helpers y Utilidades:
Incluimos funciones helper para facilitar las pruebas:

   * Generación de tokens para pruebas
   * Funciones de limpieza de datos
   * Utilidades para crear datos de prueba

> Importante:
> Para ejecutar las pruebas, añade estos scripts a tu package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration"
  }
}
```

    

