# FASE 3 - Backend Integration

## Descripción
Implementación completa de los 18 casos de uso restantes con paginación, seguridad por roles, generación de PDFs y validaciones mejoradas.

## Requisitos Previos
- Java 21
- Maven 3.8+
- Puerto 8090 disponible

## Configuración

### Base de Datos
El proyecto usa H2 en memoria para desarrollo. Los datos se inicializan automáticamente al arrancar.

### Credenciales de Prueba

#### Administrador
- **Correo:** `admin@academia.ud`
- **Contraseña:** `Admin123*`

#### Profesores
- **Correo:** `maria.gonzalez@academia.ud` | **Contraseña:** `Prof123*`
- **Correo:** `carlos.rodriguez@academia.ud` | **Contraseña:** `Prof123*`

#### Acudientes
- **Correo:** `ana.martinez@correo.com` | **Contraseña:** `Acud123*`
- **Correo:** `luis.garcia@correo.com` | **Contraseña:** `Acud123*`

## Ejecución

### Método 1: Maven Wrapper (Recomendado)
```bash
# Windows
.\mvnw.cmd spring-boot:run -Dspring.profiles.active=dev

# Linux/Mac
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### Método 2: Maven Instalado
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

## Acceso a Servicios

- **API REST:** http://localhost:8090/api
- **Swagger UI:** http://localhost:8090/swagger-ui.html
- **H2 Console:** http://localhost:8090/h2-console
  - JDBC URL: `jdbc:h2:mem:academia_dev`
  - Username: `sa`
  - Password: *(vacío)*

## Nuevas Funcionalidades FASE 3

### 1. Paginación
Todos los endpoints de listado soportan paginación:
- `GET /api/usuarios?page=0&size=20`
- `GET /api/aspirantes?page=0&size=20&estado=SIN_REVISAR`
- `GET /api/grupos?page=0&size=20`
- `GET /api/citaciones?page=0&size=20&tipo=GRUPO`
- `GET /api/calificaciones?page=0&size=20&estudianteId=1&periodo=PRIMER_PERIODO`

### 2. Generación de PDFs
#### Listado de Grupo (C.U 34)
```bash
GET /api/grupos/{id}/listado.pdf
```
- Logo Veritas incluido
- Header celeste (#E6F2FF)
- Fuente Inter
- Tabla horizontal con información de estudiantes

#### Boletín Estudiantil (C.U 8)
```bash
GET /api/calificaciones/reporte/boletin.pdf?estudianteId=1&periodo=PRIMER_PERIODO
```
- Logo Veritas
- Logros con notas por período
- Placeholder para firma digital

### 3. Seguridad por Roles
Todos los endpoints tienen restricciones:
- `@PreAuthorize("hasRole('ADMIN')")` - Solo administradores
- `@PreAuthorize("hasRole('PROFESOR')")` - Solo profesores
- `@PreAuthorize("hasRole('ACUDIENTE')")` - Solo acudientes

### 4. Gestión de Estados de Citaciones
```bash
PATCH /api/citaciones/{id}/estado?estado=CONFIRMADA
```
Estados permitidos: PENDIENTE, CONFIRMADA, CANCELADA, REALIZADA

### 5. Validaciones Mejoradas
- **Notas:** 1.0 - 5.0 (@DecimalMin / @DecimalMax)
- **Fecha citación:** >= hoy
- **Capacidad grupo:** <= 20 estudiantes
- **Estado aspirante:** Solo ADMIN puede modificar
- **Calificaciones:** Solo PROFESOR del grupo puede editar

## Datos de Prueba (DataLoader)

El sistema carga automáticamente:
- ✅ 50+ usuarios (admin, profesores, acudientes, aspirantes)
- ✅ 30 aspirantes con diferentes estados
- ✅ 20 grupos activos y en borrador
- ✅ 100+ calificaciones distribuidas en diferentes períodos
- ✅ 50+ citaciones de diferentes tipos
- ✅ 15 logros académicos

## Estructura del Proyecto

```
src/main/java/co/udistrital/academia/
├── config/              # Configuraciones (Security, CORS, Swagger)
├── controller/          # Endpoints REST con @PreAuthorize
├── dto/                 # DTOs request/response
├── entity/              # Entidades JPA con @JsonIgnore
├── exception/           # Manejo global de excepciones
├── repository/          # Interfaces Spring Data JPA
├── service/             # Lógica de negocio + PDFs
└── DataLoader.java      # Carga de datos iniciales
```

## Testing Manual

### 1. Paginación
```bash
# Usuarios página 1
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/usuarios?page=0&size=5"

# Usuarios página 2
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/usuarios?page=1&size=5"
```

### 2. Filtros
```bash
# Aspirantes sin revisar
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/aspirantes?estado=SIN_REVISAR"

# Calificaciones por estudiante y período
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/calificaciones?estudianteId=1&periodo=PRIMER_PERIODO"
```

### 3. Descargar PDFs
```bash
# Listado de grupo
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/grupos/1/listado.pdf" \
  --output listado.pdf

# Boletín
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8090/api/calificaciones/reporte/boletin.pdf?estudianteId=1&periodo=PRIMER_PERIODO" \
  --output boletin.pdf
```

## Troubleshooting

### Error: "Port 8090 is already in use"
```bash
# Windows
netstat -ano | findstr :8090
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8090
kill -9 <PID>
```

### Error: "JWT Secret too short"
Verificar que en `application-dev.yml` la clave JWT tenga al menos 64 caracteres:
```yaml
jwt:
  secret: academia-ud-jwt-secret-key-2024-this-is-a-very-long-secure-key-for-hs512-algorithm-minimum-64-characters
```

### Error: "User not authenticated"
1. Obtener token en `/api/auth/login`
2. Incluir en header: `Authorization: Bearer <token>`
3. Verificar que el token no haya expirado (24 horas)

## Endpoints Completos

### Autenticación
- `POST /api/auth/login` - Login con correo/contraseña
- `POST /api/auth/first-login` - Cambio de contraseña temporal

### Usuarios (ADMIN)
- `GET /api/usuarios?page=&size=` - Listado paginado
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Desactivar usuario

### Aspirantes (ADMIN)
- `GET /api/aspirantes?page=&size=&estado=` - Listado paginado con filtro
- `POST /api/aspirantes` - Crear aspirante
- `PATCH /api/aspirantes/{id}/estado` - Cambiar estado
- `PUT /api/aspirantes/{id}/entrevista` - Agendar entrevista

### Grupos (ADMIN/PROFESOR)
- `GET /api/grupos?page=&size=` - Listado paginado
- `POST /api/grupos` - Crear grupo
- `PATCH /api/grupos/{id}/confirmar` - Confirmar grupo
- `POST /api/grupos/{id}/estudiantes` - Agregar estudiante
- `GET /api/grupos/{id}/listado.pdf` - Descargar listado PDF

### Citaciones (ADMIN/PROFESOR)
- `GET /api/citaciones?page=&size=&tipo=` - Listado paginado con filtro
- `POST /api/citaciones` - Crear citación
- `PATCH /api/citaciones/{id}/estado` - Cambiar estado

### Calificaciones (PROFESOR)
- `GET /api/calificaciones?page=&size=&estudianteId=&periodo=` - Listado paginado con filtros
- `POST /api/calificaciones` - Crear calificación
- `PUT /api/calificaciones/{id}` - Actualizar calificación
- `GET /api/calificaciones/reporte/boletin.pdf` - Descargar boletín PDF

### Reportes (PROFESOR/ACUDIENTE)
- `GET /api/reportes/boletin` - Boletín JSON
- `GET /api/reportes/observador/{estudianteId}` - Observador del estudiante

## Soporte

Para problemas o consultas sobre la implementación, revisar:
1. Logs de la aplicación en consola
2. Swagger UI para documentación interactiva
3. H2 Console para verificar datos en BD
