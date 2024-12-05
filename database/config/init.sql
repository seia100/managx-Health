-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('MEDICO', 'ENFERMERO', 'ADMINISTRADOR')),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    intentos_fallidos INTEGER DEFAULT 0,
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabla de Pacientes
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    tipo_sangre VARCHAR(5),
    alergias TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT edad_check CHECK (fecha_nacimiento <= CURRENT_DATE),
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabla de Historiales Médicos
CREATE TABLE historiales_medicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id UUID NOT NULL REFERENCES usuarios(id),
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT,
    tratamiento TEXT,
    archivos_adjuntos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas
CREATE TABLE citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id UUID NOT NULL REFERENCES usuarios(id),
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('PROGRAMADA', 'COMPLETADA', 'CANCELADA')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fecha_futura_check CHECK (fecha_hora > CURRENT_TIMESTAMP)
);

-- Índices para optimización de consultas frecuentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_pacientes_nombre ON pacientes(nombre);
CREATE INDEX idx_historiales_paciente ON historiales_medicos(paciente_id);
CREATE INDEX idx_citas_medico_fecha ON citas(medico_id, fecha_hora);
CREATE INDEX idx_citas_paciente_fecha ON citas(paciente_id, fecha_hora);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualización automática de timestamps
CREATE TRIGGER update_pacientes_modtime
    BEFORE UPDATE ON pacientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historiales_modtime
    BEFORE UPDATE ON historiales_medicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citas_modtime
    BEFORE UPDATE ON citas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


---------------------------------------------------------------------------

-- -- Crear tabla de usuarios
-- CREATE TABLE IF NOT EXISTS usuarios (
--     id SERIAL PRIMARY KEY,
--     nombre VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     contraseña VARCHAR(255) NOT NULL,
--     rol VARCHAR(50) NOT NULL CHECK (rol IN ('Médico', 'Enfermero', 'Administrador')),
--     fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Crear tabla de pacientes
-- CREATE TABLE IF NOT EXISTS pacientes (
--     id SERIAL PRIMARY KEY,
--     nombre VARCHAR(255) NOT NULL,
--     fechaNacimiento DATE NOT NULL,
--     direccion VARCHAR(255),
--     telefono VARCHAR(20),
--     email VARCHAR(255) UNIQUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Crear tabla de historiales médicos
-- CREATE TABLE IF NOT EXISTS historiales_medicos (
--     id SERIAL PRIMARY KEY,
--     pacienteId INT NOT NULL,
--     descripcion TEXT NOT NULL,
--     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     medicoId INT NOT NULL,
--     FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
--     FOREIGN KEY (medicoId) REFERENCES usuarios(id) ON DELETE CASCADE
-- );

-- -- Crear tabla de citas
-- CREATE TABLE IF NOT EXISTS citas (
--     id SERIAL PRIMARY KEY,
--     pacienteId INT NOT NULL,
--     medicoId INT NOT NULL,
--     fechaHora TIMESTAMP NOT NULL,
--     motivo TEXT,
--     estado VARCHAR(50) NOT NULL CHECK (estado IN ('Programada', 'Completada', 'Cancelada')),
--     FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
--     FOREIGN KEY (medicoId) REFERENCES usuarios(id) ON DELETE CASCADE
-- );
