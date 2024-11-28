# Guía de instalación

## Entorno desarrollador

### **Requisitos Previos**

Asegúrate de tener instalados los siguientes componentes antes de empezar:

- **Node.js** (versión LTS recomendada)
- **npm** (incluido con Node.js)
- **TypeScript** (globalmente: `npm install -g typescript`)
- **Docker** y **Docker Compose**
- **PostgreSQL** (si no lo usarás en Docker)
- **Git**

### **Pasos para Inicializar el Proyecto**

Tener en cuenta que estoy siguiendo las recomendaciones de las siguientes fuentes:
- [Building Your First Full-Stack Application: A Step-by-Step Guide for Beginners](https://medium.com/@codewithwaheed/building-your-first-full-stack-application-a-step-by-step-guide-for-beginners-8e159454ac71)

- [How to Architect a Full-Stack Application from Start to Finish](https://www.freecodecamp.org/news/how-to-build-a-full-stack-application-from-start-to-finish/)

  > **Nota:**
  > En este caso le agregamos explicitamente la carpeta _backend_



#### **Clonar el Repositorio**

Si ya tienes un repositorio inicializado:

  ```bash
  git clone https://github.com/seia100/managx-Health.git
  cd managx-health

  ```

- Posterior a ello inicialimos el proyecto

  ```shell
  git init
  npm init -y
  ```

- Editamos el archivo `package.json`

  ```json
    {
    "name": "managx-health",
    "version": "1.0.0",
    "description": "Basic health data management, including user management, medical records and appointments, with a focus on safety and authentication.",
    "workspaces": [
      "frontend",
      "backend"
    ],
    "private": true,
    "scripts": {
      "start": "concurrently \"npm run start:frontend\" \"npm run start:backend\"",
      "start:frontend": "npm --workspace frontend start",
      "start:backend": "npm --workspace backend start",
      "build": "npm --workspace frontend build && npm --workspace backend build",
      "test": "npm --workspaces test"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "concurrently": "^9.1.0"
    }
  }

  ```

> Agregar esta linea para poder ejecutar dos comandos a la vez
>  `npm i -D concurrently`
> 
La razon por la que editamos esta para tener una mayor versatilidad de ejecucion y tambien trabajar con subporyectos.

> **Importante**
> Tener en cuenta que la modificacion hace uso especifico de workspaces. Este nos ayuda a gestionar o indicar que tiene subporyectos internos y asi evitamos que haya conflicto.
>

### Configurar el backend

- Inicializar el backend

  ```shell
  mkdir backend
  cd backend
  npm init -y

  # Dependencias necesarias 
  npm install express pg bcrypt jsonwebtoken dotenv joi cors body-parser class-validator
  npm install -D typescript ts-node nodemon @types/node @types/express jest ts-jest supertest @types/jest

  ## controllers, 
  npm i --save-dev @types/bcrypt @types/jsonwebtoken
  ```

- Configurar TypeScript

  ```shell
  npx tsc --init
  ```

### Configurar el fronted

- Inicializar el frontend

  ```shell
  cd frontend
  npx create-react-app . --template typescript
  npm install axios react-router-dom @types/react-router-dom
  cd ..

  ```
