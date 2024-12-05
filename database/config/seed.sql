-- seed.sql

-- Concepto: Generación de datos para poblar las tablas
-- Este script se utiliza para insertar datos aleatorios en las tablas creadas en init.sql.
-- Ayuda a probar la funcionalidad de la base de datos y las relaciones entre tablas.

-- Generar datos en la tabla usuarios
-- Nota: Aquí usamos UUIDs generados automáticamente y datos aleatorios representativos.
INSERT INTO usuarios (nombre, email, password_hash, rol, ultimo_acceso, intentos_fallidos)
VALUES 
('Carlos Pérez', 'carlos.perez@example.com', md5('password123'), 'MEDICO', NOW(), 0),
('Ana Gómez', 'ana.gomez@example.com', md5('securepass456'), 'ENFERMERO', NOW() - INTERVAL '1 day', 1),
('Luis Martínez', 'luis.martinez@example.com', md5('admin789'), 'ADMINISTRADOR', NOW() - INTERVAL '2 days', 2);

-- Generar datos en la tabla pacientes
-- Concepto: `array[]` y `JSONB` se utilizan para almacenar datos estructurados como alergias.
INSERT INTO pacientes (nombre, fecha_nacimiento, direccion, telefono, email, tipo_sangre, alergias)
VALUES
('Pedro López', '1980-05-15', 'Calle Falsa 123', '555-1234', 'pedro.lopez@example.com', 'O+', array['Penicilina', 'Polen']),
('María Ruiz', '1992-07-22', 'Avenida Siempreviva 456', '555-5678', 'maria.ruiz@example.com', 'A-', array['Frutos secos']),
('Sofía García', '2000-01-01', 'Plaza Principal 789', '555-9876', NULL, 'B+', array[]);

-- Generar datos en la tabla historiales_medicos
-- Concepto: Relaciones entre tablas (FOREIGN KEY).
INSERT INTO historiales_medicos (paciente_id, medico_id, descripcion, diagnostico, tratamiento, archivos_adjuntos)
VALUES
((SELECT id FROM pacientes LIMIT 1), 
    (SELECT id FROM usuarios WHERE rol = 'MEDICO' LIMIT 1), 
    'Dolor de cabeza persistente', 
    'Migraña', 
    'Analgésicos y reposo', 
    '{"imagen1": "url_a_imagen1", "imagen2": "url_a_imagen2"}'::jsonb),
((SELECT id FROM pacientes LIMIT 1 OFFSET 1), 
    (SELECT id FROM usuarios WHERE rol = 'MEDICO' LIMIT 1), 
    'Fractura de brazo', 
    'Fractura ósea simple', 
    'Yeso por 6 semanas', 
    '{"rayos_x": "url_a_rayos_x"}'::jsonb);

-- Generar datos en la tabla citas
-- Concepto: Validación de fechas futuras y relaciones.
INSERT INTO citas (paciente_id, medico_id, fecha_hora, motivo, estado, notas)
VALUES
((SELECT id FROM pacientes LIMIT 1), 
    (SELECT id FROM usuarios WHERE rol = 'MEDICO' LIMIT 1), 
    NOW() + INTERVAL '1 day', 
    'Chequeo general', 
    'PROGRAMADA', 
    'Paciente pidió chequeo general'),
    ((SELECT id FROM pacientes LIMIT 1 OFFSET 1), 
    (SELECT id FROM usuarios WHERE rol = 'MEDICO' LIMIT 1), 
    NOW() + INTERVAL '2 days', 
    'Control post-fractura', 
    'PROGRAMADA', 
    'Control para evaluar progreso de fractura'),
    ((SELECT id FROM pacientes LIMIT 1 OFFSET 2), 
    (SELECT id FROM usuarios WHERE rol = 'ENFERMERO' LIMIT 1), 
    NOW() + INTERVAL '3 days', 
    'Toma de muestras', 
    'PROGRAMADA', 
    'Análisis de laboratorio');

-- Concepto: Enfoque modular
-- Este script está separado de init.sql para mantener la lógica de generación de datos aislada.
