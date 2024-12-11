# Healthcare Platform

Sistema integral de gestión médica que permite administrar pacientes, citas médicas, historiales clínicos y personal médico.

## 🏗️ Arquitectura

### Backend
- **Node.js + Express + TypeScript**
- Base de datos: PostgreSQL
- Cache: Redis
- Autenticación: JWT
- Validación: Joi
- Logs: Winston
- Tests: Jest

### Frontend
- **React + TypeScript**
- Gestión de estado: Context API
- UI Components: Tailwind CSS
- Forms: React Hook Form
- Validación: Yup
- HTTP Client: Axios

## 🚀 Requisitos Previos

- Node.js >= 14.x
- PostgreSQL >= 13
- Redis >= 6.0
- Git

## 💻 Instalación y Configuración

### 1. Clonar el Repositorio

\`\`\`bash
git clone https://your-repository/healthcare-platform.git
cd healthcare-platform
\`\`\`

### 2. Configurar Backend

\`\`\`bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
\`\`\`

Editar el archivo .env con tus configuraciones:

\`\`\`env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
\`\`\`

### 3. Configurar Base de Datos

\`\`\`bash
# Crear base de datos
createdb healthcare_db

# Ejecutar migraciones
npm run migrate

[//]: # (# Ejecutar seeds)

[//]: # (npm run seed)

[//]: # (\`\`\`)

[//]: # ()
[//]: # (### 4. Configurar Frontend)

[//]: # ()
[//]: # (\`\`\`bash)

# Navegar al directorio del frontend
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
\`\`\`

## 🚀 Ejecución

### Desarrollo

\`\`\`bash
# Backend (desde directorio /backend)
npm run dev

# Frontend (desde directorio /frontend)
npm run dev
\`\`\`


# Backend
npm run build
npm start

# Frontend
npm run build
npm start
\`\`\`

## 📝 API Endpoints

### Autenticación
- POST /api/auth/register - Registro de usuarios
- POST /api/auth/login - Login de usuarios

### Usuarios
- GET /api/users/:id - Obtener perfil
- PUT /api/users/:id - Actualizar perfil
- DELETE /api/users/:id - Eliminar usuario (solo Admin)

### Pacientes
- POST /api/patients - Crear paciente
- GET /api/patients - Listar pacientes
- GET /api/patients/:id - Obtener paciente
- PUT /api/patients/:id - Actualizar paciente
- DELETE /api/patients/:id - Eliminar paciente

### Historiales Médicos
- POST /api/medical-records - Crear historial
- GET /api/patients/:id/medical-records - Obtener historial de paciente
- PUT /api/medical-records/:id - Actualizar historial
- DELETE /api/medical-records/:id - Eliminar historial

### Citas
- POST /api/appointments - Crear cita
- GET /api/appointments - Listar citas
- PUT /api/appointments/:id - Actualizar cita
- DELETE /api/appointments/:id - Cancelar cita

## 👥 Roles y Permisos

### Administrador
- Gestión completa de usuarios
- Acceso a todas las funcionalidades
- Reportes y estadísticas

### Médico
- Ver y actualizar perfiles de pacientes
- Gestionar historiales médicos
- Gestionar citas
- Ver reportes propios

### Enfermero
- Ver perfiles de pacientes
- Registrar signos vitales
- Ver historiales médicos
- Gestionar citas


# Ejecutar tests de integración
Tener en cuenta que los test y pruebas esa por mejorar y no estan funcionales :c
```shell
npm run test:integration
##
```

## 📊 Resultado Esperado

### Funcionalidades Principales:

1. **Gestión de Usuarios**
   - Registro y autenticación
   - Perfiles de usuario por rol
   - Gestión de permisos

2. **Gestión de Pacientes**
   - Ficha completa del paciente
   - Historial médico detallado
   - Seguimiento de tratamientos

3. **Gestión de Citas**
   - Programación de citas
   - Calendario médico
   - Notificaciones

4. **Historiales Médicos**
   - Registro de consultas
   - Historial de tratamientos
   - Adjuntos y documentación

### Interfaz de Usuario:

1. **Dashboard Principal**
   - Resumen de actividades
   - Citas del día
   - Estadísticas rápidas

2. **Sección de Pacientes**
   - Lista de pacientes
   - Búsqueda avanzada
   - Fichas detalladas

3. **Calendario de Citas**
   - Vista mensual/semanal/diaria
   - Gestión de disponibilidad
   - Confirmaciones

4. **Historiales Médicos**
   - Línea de tiempo
   - Documentos adjuntos
   - Historial de tratamientos

## 🔒 Seguridad

- Autenticación JWT
- Encriptación de datos sensibles
- Control de acceso basado en roles
- Protección contra XSS y CSRF
- Rate limiting
- Validación de datos

## 📈 Monitoreo

- Logs de sistema
- Métricas de rendimiento
- Alertas de errores
- Auditoría de acciones

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push al branch (\`git push origin feature/AmazingFeature\`)
5. Abrir Pull Request

> Importante:
> Si se desea colaborar por favor incluir el tema de la caracteristica y relacionada si es que se trata del backend, frontend o database
> Actualmente hay dos ramas tanto para database y backend