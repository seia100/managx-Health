
# Implementación de Base de Datos con PostgreSQL y Docker Compose

## **Índice**
- [Implementación de Base de Datos con PostgreSQL y Docker Compose](#implementación-de-base-de-datos-con-postgresql-y-docker-compose)
  - [**Índice**](#índice)
  - [**Introducción**](#introducción)
  - [**Configuración de PostgreSQL con Docker Compose**](#configuración-de-postgresql-con-docker-compose)
    - [**Instalación**](#instalación)
    - [**Estructura del `docker-compose.yml`**](#estructura-del-docker-composeyml)
      - [**Explicación técnica**:](#explicación-técnica)
      - [**Levantar el servicio**:](#levantar-el-servicio)
  - [**Migraciones con `node-pg-migrate`**](#migraciones-con-node-pg-migrate)
    - [**¿Qué son las migraciones?**](#qué-son-las-migraciones)
    - [**Instalación y Configuración**](#instalación-y-configuración)
    - [**Crear y Aplicar Migraciones**](#crear-y-aplicar-migraciones)
  - [**Buenas Prácticas en el Diseño de Bases de Datos**](#buenas-prácticas-en-el-diseño-de-bases-de-datos)
  - [**Referencias**](#referencias)

---

## **Introducción**

PostgreSQL es un sistema de gestión de bases de datos relacional (RDBMS) conocido por su robustez, extensibilidad y cumplimiento con estándares. Utilizar **Docker Compose** simplifica la configuración y despliegue de PostgreSQL, permitiendo un entorno replicable en cualquier máquina.

Este documento guía en la implementación de una base de datos PostgreSQL para un proyecto local utilizando:
- **Docker Compose** para contenerización.
- **node-pg-migrate** para gestionar migraciones.
- Buenas prácticas en diseño y gestión de bases de datos.

---

## **Configuración de PostgreSQL con Docker Compose**

### **Instalación**

1. **Pre-requisitos**:
    - Docker: [Guía de instalación oficial](https://docs.docker.com/get-docker/)
    - Docker Compose: Incluido con Docker en versiones modernas.

2. **Verificar instalación**:
    > Tener en cuenta omitir `sudo` antes de cada comando. para ello revisar: [How to fix: Docker Permission Denied](https://www.linkedin.com/pulse/resolving-docker-permission-denied-error-guide-om-prakash-singh/)
  
    Ejecuta los siguientes comandos para asegurarte de que Docker y Docker Compose están instalados:
    ```bash
    docker --version
    docker compose version
    ```

---

### **Estructura del `docker-compose.yml`**

Crea un archivo `docker-compose.yml` en el directorio raíz del proyecto con la siguiente configuración:

```yaml
version: "3.9"
services:
    db:
        image: postgres:13
        container_name: healthcare-db
        environment:
            POSTGRES_USER: admin
            POSTGRES_PASSWORD: admin
            POSTGRES_DB: healthcare
        ports:
            - "5432:5432"
        volumes:
            - db-data:/var/lib/postgresql/data
        networks:
            - healthcare-network

volumes:
    db-data:

networks:
    healthcare-network:
```

#### **Explicación técnica**:
1. **Servicios**:
    - `db`: Define el servicio PostgreSQL.
        - `image`: Usa la imagen oficial de PostgreSQL versión `13`.
        - `environment`: Define variables de entorno para configurar el usuario, contraseña y base de datos inicial.
        - `ports`: Mapea el puerto `5432` del contenedor al host para accesibilidad.
        - `volumes`: Almacena datos persistentes fuera del contenedor.

2. **Volúmenes**:
    - `db-data`: Almacena los datos de PostgreSQL incluso si el contenedor se elimina.

3. **Redes**:
    - `healthcare-network`: Asegura que los servicios en el mismo `docker-compose.yml` puedan comunicarse.

#### **Levantar el servicio**:
Ejecuta el comando para iniciar PostgreSQL:
```bash
docker-compose up -d
```

Verifica que el servicio esté corriendo:
```bash
docker ps
```

Para detener los servicios:
```bash
docker-compose down
```

---

## **Migraciones con `node-pg-migrate`**

### **¿Qué son las migraciones?**

Las migraciones son scripts que gestionan la evolución del esquema de la base de datos. Te permiten:
- Crear, modificar y eliminar tablas.
- Rastrear cambios en el esquema.
- Garantizar consistencia entre entornos.

### **Instalación y Configuración**

1. **Instalar `node-pg-migrate`**:
    Desde el directorio del backend:
    ```bash
    npm install node-pg-migrate
    ```

2. **Configurar migraciones**:
    Crea un archivo de configuración `migration-config.js` en la carpeta `backend`:
    ```js
    module.exports = {
        databaseUrl: {
            user: process.env.POSTGRES_USER || 'admin',
            password: process.env.POSTGRES_PASSWORD || 'admin',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.POSTGRES_DB || 'healthcare',
        },
        dir: 'database/migrations',
    };
    ```

3. **Crear directorios de migraciones**:
    ```bash
    mkdir -p database/migrations
    ```

---

### **Crear y Aplicar Migraciones**
- [SQL migrations in PostgreSQL, part 1](https://medium.com/miro-engineering/sql-migrations-in-postgresql-part-1-bc38ec1cbe75)
- [Using Migration Scripts in Database Deployments](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/using-migration-scripts-in-database-deployments/)
1. **Crear una migración**:
    Usa el siguiente comando para generar un archivo de migración:
    ```bash
    npx node-pg-migrate create init
    ```

2. **Escribir el esquema inicial**:
    Edita el archivo generado en `database/migrations`:
    ```javascript
    exports.up = (pgm) => {
        pgm.createTable('users', {
            id: { type: 'serial', primaryKey: true },
            name: { type: 'varchar(100)', notNull: true },
            email: { type: 'varchar(100)', unique: true, notNull: true },
            password: { type: 'varchar(255)', notNull: true },
            role: { type: 'varchar(50)', default: 'user' },
            created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        });

        pgm.createTable('patients', {
            id: { type: 'serial', primaryKey: true },
            name: { type: 'varchar(100)', notNull: true },
            birth_date: { type: 'date', notNull: true },
            address: { type: 'text' },
            phone: { type: 'varchar(15)' },
            email: { type: 'varchar(100)' },
        });
    };

    exports.down = (pgm) => {
        pgm.dropTable('patients');
        pgm.dropTable('users');
    };
    ```

3. **Aplicar migraciones**:
    Ejecuta las migraciones:
    ```bash
    npx node-pg-migrate up
    ```

4. **Revertir migraciones**:
    Si necesitas revertir:
    ```bash
    npx node-pg-migrate down
    ```

---

## **Buenas Prácticas en el Diseño de Bases de Datos**

1. **Normalización**:
    - Las tablas estan en la tercera forma normal (3NF) para reducir redundancias.

2. **Índices**:
    - Usa índices en columnas utilizadas frecuentemente en búsquedas (`email`, `id`).

3. **Seguridad**:
    - Restringe el acceso al usuario PostgreSQL configurado.
    - Usa `pgcrypto` para operaciones sensibles, como hash de contraseñas.

4. **Validación de datos**:
    - Usa tipos de datos apropiados (`varchar`, `timestamp`) y restricciones (`NOT NULL`, `UNIQUE`, `CHECK`).

5. **Backups**:
    - Configura backups automáticos del volumen `db-data` para recuperación en caso de fallos.

---

## **Referencias**
**main resource:** 
- [How to Use the Postgres Docker Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/#Why-should-you-containerize-Postgres) 

**Recursos adicionales:**
- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [Docker Compose para PostgreSQL](https://docs.docker.com/samples/postgresql_service/)
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [Guía de normalización de bases de datos](https://en.wikipedia.org/wiki/Database_normalization)

