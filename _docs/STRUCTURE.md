 # Estructura del proyecto


```shell
/managx-health
├── /backend
│   ├── /src
│   │   ├── /config
│   │   │   ├── db.ts                  # Configuración de la conexión a PostgreSQL
│   │   │   ├── env.ts                 # Configuración de variables de entorno
│   │   │   ├── logger.ts              # Configuración de logs
│   │   ├── /controllers
│   │   │   ├── authController.ts      # Controlador para autenticación
│   │   │   ├── userController.ts      # Controlador para usuarios
│   │   │   ├── patientController.ts   # Controlador para pacientes
│   │   │   ├── historyController.ts   # Controlador para historiales médicos
│   │   │   ├── appointmentController.ts # Controlador para citas
│   │   ├── /middlewares
│   │   │   ├── authMiddleware.ts      # Middleware de autenticación y autorización
│   │   │   ├── errorHandler.ts        # Manejo de errores
│   │   │   ├── validationMiddleware.ts # Middleware de validación (con Joi)
│   │   ├── /models
│   │   │   ├── userModel.ts           # Modelo de usuario
│   │   │   ├── patientModel.ts        # Modelo de paciente
│   │   │   ├── historyModel.ts        # Modelo de historial médico
│   │   │   ├── appointmentModel.ts    # Modelo de cita
│   │   ├── /routes
│   │   │   ├── authRoutes.ts          # Rutas de autenticación
│   │   │   ├── userRoutes.ts          # Rutas de usuarios
│   │   │   ├── patientRoutes.ts       # Rutas de pacientes
│   │   │   ├── historyRoutes.ts       # Rutas de historiales médicos
│   │   │   ├── appointmentRoutes.ts   # Rutas de citas
│   │   ├── /services
│   │   │   ├── authService.ts         # Lógica de negocio para autenticación
│   │   │   ├── userService.ts         # Lógica de negocio para usuarios
│   │   │   ├── patientService.ts      # Lógica de negocio para pacientes
│   │   │   ├── historyService.ts      # Lógica de negocio para historiales médicos
│   │   │   ├── appointmentService.ts  # Lógica de negocio para citas
│   │   ├── /utils
│   │   │   ├── bcryptHelper.ts        # Utilidad para manejo de contraseñas
│   │   │   ├── jwtHelper.ts           # Utilidad para manejo de tokens JWT
│   │   │   ├── validationSchemas.ts   # Esquemas de validación (Joi)
│   │   ├── app.ts                     # Configuración principal de Express
│   │   ├── server.ts                  # Inicialización del servidor
│   ├── /tests
│   │   ├── auth.test.ts               # Pruebas para autenticación
│   │   ├── user.test.ts               # Pruebas para usuarios
│   │   ├── patient.test.ts            # Pruebas para pacientes
│   │   ├── history.test.ts            # Pruebas para historiales médicos
│   │   ├── appointment.test.ts        # Pruebas para citas
│   ├── Dockerfile                     # Configuración de Docker para el backend
│   ├── package.json                   # Dependencias y scripts del backend
│   ├── tsconfig.json                  # Configuración de TypeScript
│   ├── jest.config.js                 # Configuración de Jest
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── AuthForm.tsx           # Componente para formularios de login/registro
│   │   │   ├── UserProfile.tsx        # Componente para el perfil de usuario
│   │   │   ├── PatientList.tsx        # Componente para lista de pacientes
│   │   │   ├── PatientForm.tsx        # Componente para creación/edición de pacientes
│   │   │   ├── AppointmentScheduler.tsx # Componente para gestionar citas
│   │   ├── /context
│   │   │   ├── AuthContext.tsx        # Contexto de autenticación
│   │   │   ├── AppContext.tsx         # Contexto global
│   │   ├── /hooks
│   │   │   ├── useAuth.ts             # Hook personalizado para autenticación
│   │   ├── /pages
│   │   │   ├── index.tsx              # Página de inicio
│   │   │   ├── login.tsx              # Página de login
│   │   │   ├── dashboard.tsx          # Página principal del dashboard
│   │   ├── /services
│   │   │   ├── api.ts                 # Configuración de axios para consumir el backend
│   │   │   ├── authService.ts         # Servicio para autenticación
│   │   │   ├── userService.ts         # Servicio para usuarios
│   │   │   ├── patientService.ts      # Servicio para pacientes
│   │   ├── App.tsx                    # Configuración principal de la app
│   │   ├── index.tsx                  # Entrada principal de React
│   ├── Dockerfile                     # Configuración de Docker para el frontend
│   ├── package.json                   # Dependencias y scripts del frontend
│   ├── tsconfig.json                  # Configuración de TypeScript
├── /database
│   ├── /migrations                    # Archivos de migraciones
│   │   ├── 01-create-users.sql
│   │   ├── 02-create-patients.sql
│   │   ├── 03-create-histories.sql
│   │   ├── 04-create-appointments.sql
│   ├── /seeders                       # Archivos para datos de prueba
│   │   ├── 01-users.seed.sql
│   │   ├── 02-patients.seed.sql
├── /docker
│   ├── docker-compose.yml             # Orquestación de servicios con Docker Compose
│   ├── .env                           # Variables de entorno compartidas
├── /docs
│   ├── INSTALL.md                     # Guía de instalación
│   ├── USAGE.md                       # Manual de uso
│   ├── API.md                         # Documentación de la API
├── .gitignore                         # Archivos y carpetas a ignorar en Git
├── README.md                          # Descripción del proyecto

```
