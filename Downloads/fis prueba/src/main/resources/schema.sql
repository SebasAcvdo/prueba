-- Script de creación de base de datos MySQL para Academia UD
-- Fase 1 - Backend Spring Boot Reactivo

DROP DATABASE IF EXISTS academia_ud;
CREATE DATABASE academia_ud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academia_ud;

-- Tabla token_usuario
CREATE TABLE token_usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_temporal VARCHAR(50),
    contrasena_temporal VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla usuario
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'PROFESOR', 'ACUDIENTE', 'ASPIRANTE') NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    token_usuario_id BIGINT,
    CONSTRAINT fk_usuario_token FOREIGN KEY (token_usuario_id) REFERENCES token_usuario(id),
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla grupo
CREATE TABLE grupo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grado VARCHAR(50) NOT NULL,
    capacidad INT NOT NULL DEFAULT 20,
    estado ENUM('BORRADOR', 'ACTIVO') NOT NULL DEFAULT 'BORRADOR',
    profesor_id BIGINT,
    CONSTRAINT fk_grupo_profesor FOREIGN KEY (profesor_id) REFERENCES usuario(id),
    INDEX idx_grado (grado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla aspirante
CREATE TABLE aspirante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estado_inscripcion ENUM('SIN_REVISAR', 'REVISADO', 'ESPERA_ENTREVISTA', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'SIN_REVISAR',
    fecha_entrevista DATE,
    usuario_id BIGINT,
    CONSTRAINT fk_aspirante_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    INDEX idx_estado_inscripcion (estado_inscripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla estudiante
CREATE TABLE estudiante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    grado VARCHAR(50) NOT NULL,
    reg_civil VARCHAR(50),
    estado ENUM('ACTIVO', 'INACTIVO', 'RETIRADO') NOT NULL DEFAULT 'ACTIVO',
    acudiente_id BIGINT,
    grupo_id BIGINT,
    aspirante_id BIGINT,
    CONSTRAINT fk_estudiante_acudiente FOREIGN KEY (acudiente_id) REFERENCES usuario(id),
    CONSTRAINT fk_estudiante_grupo FOREIGN KEY (grupo_id) REFERENCES grupo(id),
    CONSTRAINT fk_estudiante_aspirante FOREIGN KEY (aspirante_id) REFERENCES aspirante(id),
    INDEX idx_grado (grado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla citacion
CREATE TABLE citacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('INDIVIDUAL', 'GRUPAL', 'ASPIRANTE') NOT NULL,
    fecha DATETIME NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    estado_cita ENUM('PENDIENTE', 'REALIZADA', 'CANCELADA', 'APLAZADA') NOT NULL DEFAULT 'PENDIENTE',
    INDEX idx_tipo (tipo),
    INDEX idx_estado_cita (estado_cita)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla citacion_acudiente (ManyToMany)
CREATE TABLE citacion_acudiente (
    citacion_id BIGINT NOT NULL,
    acudiente_id BIGINT NOT NULL,
    PRIMARY KEY (citacion_id, acudiente_id),
    CONSTRAINT fk_citacion_acudiente_citacion FOREIGN KEY (citacion_id) REFERENCES citacion(id),
    CONSTRAINT fk_citacion_acudiente_usuario FOREIGN KEY (acudiente_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla citacion_profesor (ManyToMany)
CREATE TABLE citacion_profesor (
    citacion_id BIGINT NOT NULL,
    profesor_id BIGINT NOT NULL,
    PRIMARY KEY (citacion_id, profesor_id),
    CONSTRAINT fk_citacion_profesor_citacion FOREIGN KEY (citacion_id) REFERENCES citacion(id),
    CONSTRAINT fk_citacion_profesor_usuario FOREIGN KEY (profesor_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla citacion_aspirante (ManyToMany)
CREATE TABLE citacion_aspirante (
    citacion_id BIGINT NOT NULL,
    aspirante_id BIGINT NOT NULL,
    PRIMARY KEY (citacion_id, aspirante_id),
    CONSTRAINT fk_citacion_aspirante_citacion FOREIGN KEY (citacion_id) REFERENCES citacion(id),
    CONSTRAINT fk_citacion_aspirante_aspirante FOREIGN KEY (aspirante_id) REFERENCES aspirante(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla logro
CREATE TABLE logro (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion VARCHAR(500),
    categoria ENUM('PERSONAL_SOCIAL', 'COGNITIVO_LENGUAJE', 'AREA_MOTRIZ') NOT NULL,
    estado ENUM('ACTIVO', 'DESACTIVADO') NOT NULL DEFAULT 'ACTIVO',
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla calificacion
CREATE TABLE calificacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    valor DOUBLE NOT NULL,
    periodo INT NOT NULL,
    logro_id BIGINT NOT NULL,
    estudiante_id BIGINT NOT NULL,
    profesor_id BIGINT NOT NULL,
    CONSTRAINT fk_calificacion_logro FOREIGN KEY (logro_id) REFERENCES logro(id),
    CONSTRAINT fk_calificacion_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiante(id),
    CONSTRAINT fk_calificacion_profesor FOREIGN KEY (profesor_id) REFERENCES usuario(id),
    INDEX idx_periodo (periodo),
    INDEX idx_estudiante_periodo (estudiante_id, periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla historia_academica
CREATE TABLE historia_academica (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    CONSTRAINT fk_historia_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiante(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla boletin
CREATE TABLE boletin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    periodo INT NOT NULL,
    estudiante_id BIGINT NOT NULL,
    historia_academica_id BIGINT,
    CONSTRAINT fk_boletin_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiante(id),
    CONSTRAINT fk_boletin_historia FOREIGN KEY (historia_academica_id) REFERENCES historia_academica(id),
    INDEX idx_periodo (periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla boletin_logro (ManyToMany)
CREATE TABLE boletin_logro (
    boletin_id BIGINT NOT NULL,
    logro_id BIGINT NOT NULL,
    PRIMARY KEY (boletin_id, logro_id),
    CONSTRAINT fk_boletin_logro_boletin FOREIGN KEY (boletin_id) REFERENCES boletin(id),
    CONSTRAINT fk_boletin_logro_logro FOREIGN KEY (logro_id) REFERENCES logro(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla observacion
CREATE TABLE observacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    tipo ENUM('ACADEMICA', 'DISCIPLINARIA', 'CONVIVENCIA', 'LOGRO_DESTACADO') NOT NULL,
    estudiante_id BIGINT NOT NULL,
    profesor_id BIGINT NOT NULL,
    CONSTRAINT fk_observacion_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiante(id),
    CONSTRAINT fk_observacion_profesor FOREIGN KEY (profesor_id) REFERENCES usuario(id),
    INDEX idx_estudiante_fecha (estudiante_id, fecha),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
