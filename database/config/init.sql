-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Médico', 'Enfermero', 'Administrador')),
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fechaNacimiento DATE NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de historiales médicos
CREATE TABLE IF NOT EXISTS historiales_medicos (
    id SERIAL PRIMARY KEY,
    pacienteId INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    medicoId INT NOT NULL,
    FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medicoId) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    pacienteId INT NOT NULL,
    medicoId INT NOT NULL,
    fechaHora TIMESTAMP NOT NULL,
    motivo TEXT,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Programada', 'Completada', 'Cancelada')),
    FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medicoId) REFERENCES usuarios(id) ON DELETE CASCADE
);
