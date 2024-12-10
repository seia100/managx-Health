```shell
healthcare-platform/
├── src/
│   ├── config/                 # Configuraciones del proyecto
│   │   ├── database.js        # Configuración de PostgreSQL
│   │   ├── redis.js           # Configuración de Redis
│   │   └── constants.js       # Constantes globales
│   ├── controllers/           # Controladores de la aplicación
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── patient.controller.js
│   │   ├── medical-history.controller.js
│   │   └── appointment.controller.js
│   ├── middleware/            # Middlewares personalizados
│   │   ├── auth.middleware.js # Middleware de autenticación
│   │   ├── rbac.middleware.js # Control de acceso basado en roles
│   │   └── validate.middleware.js # Validación de datos
│   ├── models/               # Modelos de datos
│   │   ├── user.model.js
│   │   ├── patient.model.js
│   │   ├── medical-history.model.js
│   │   └── appointment.model.js
│   ├── routes/               # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── patient.routes.js
│   │   ├── medical-history.routes.js
│   │   └── appointment.routes.js
│   ├── services/            # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── patient.service.js
│   │   ├── medical-history.service.js
│   │   └── appointment.service.js
│   ├── utils/              # Utilidades y helpers
│   │   ├── logger.js
│   │   ├── encryption.js
│   │   └── validation-schemas.js
│   └── app.js             # Punto de entrada de la aplicación
├── tests/                 # Pruebas
│   ├── unit/
│   └── integration/
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```