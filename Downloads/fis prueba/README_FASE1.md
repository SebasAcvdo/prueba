# FASE 1 – BACKEND SPRING-BOOT REACTIVO
## Sistema de Gestión Académica Universidad Distrital

---

## 📋 Descripción del Proyecto

Sistema backend completo desarrollado con **Spring Boot 3.2.5** que implementa **18 casos de uso** para la gestión académica de un centro educativo. Incluye autenticación JWT, gestión de usuarios, aspirantes, grupos, citaciones, calificaciones y generación de reportes PDF.

---

## 🛠️ Stack Tecnológico

- **Java 17**
- **Spring Boot 3.2.5**
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-security
  - spring-boot-starter-validation
- **MySQL 8** (Producción)
- **H2 Database** (Desarrollo)
- **JWT** (io.jsonwebtoken 0.12.5)
- **MapStruct 1.5.5** + **Lombok 1.18.32**
- **iText 8.0.1** (Generación de PDFs)
- **Swagger OpenAPI 3** (springdoc-openapi-starter-webmvc-ui 2.3.0)
- **Maven 3.9**

---

## 📁 Estructura del Proyecto

```
src/main/java/co/udistrital/academia/
├── config/
│   ├── JwtAuthenticationEntryPoint.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── SecurityConfig.java
│   ├── OpenApiConfig.java
│   └── DataLoader.java
├── controller/
│   ├── AuthController.java
│   ├── UsuarioController.java
│   ├── AspiranteController.java
│   ├── GrupoController.java
│   ├── CitacionController.java
│   ├── LogroController.java
│   └── CalificacionController.java
├── dto/
│   ├── LoginRequest.java
│   ├── TokenResponse.java
│   ├── UsuarioRequest.java
│   ├── AspiranteCreateRequest.java
│   ├── GrupoRequest.java
│   ├── CitacionRequest.java
│   ├── LogroRequest.java
│   └── CalificacionRequest.java
├── entity/
│   ├── Usuario.java
│   ├── TokenUsuario.java
│   ├── Estudiante.java
│   ├── Aspirante.java
│   ├── Grupo.java
│   ├── Citacion.java
│   ├── Logro.java
│   ├── Calificacion.java
│   ├── Boletin.java
│   └── HistoriaAcademica.java
├── repository/
│   └── [Repositorios JPA]
├── service/
│   ├── AuthService.java
│   ├── UsuarioService.java
│   ├── AspiranteService.java
│   ├── GrupoService.java
│   ├── CitacionService.java
│   ├── LogroService.java
│   ├── CalificacionService.java
│   └── ReporteService.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── InvalidOperationException.java
└── util/
    └── PdfGenerator.java
```

---

## 🚀 Instalación y Configuración

### 1. Prerrequisitos

- **Java 17** o superior
- **Maven 3.9** o superior
- **MySQL 8** (para perfil `prod`)
- **Git**

### 2. Clonar el Repositorio

```bash
git clone <url-repositorio>
cd "fis prueba"
```

### 3. Configurar Base de Datos MySQL (Opcional - Solo para producción)

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script
source src/main/resources/schema.sql
```

O ejecutar manualmente:
```sql
CREATE DATABASE IF NOT EXISTS academia_ud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configurar Variables de Entorno (Opcional)

Para producción, establecer las siguientes variables:

```bash
# Windows PowerShell
$env:DB_USER="root"
$env:DB_PASS="tu_password"
$env:JWT_SECRET="tu-secret-key-de-al-menos-32-caracteres"

# Linux/Mac
export DB_USER=root
export DB_PASS=tu_password
export JWT_SECRET=tu-secret-key-de-al-menos-32-caracteres
```

### 5. Compilar el Proyecto

```bash
mvn clean install
```

### 6. Ejecutar la Aplicación

#### Modo Desarrollo (H2 en memoria):
```bash
mvn spring-boot:run
```

#### Modo Producción (MySQL):
```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

---

## 📊 Acceso a Swagger UI

Una vez iniciada la aplicación, acceder a:

**URL:** [http://localhost:8090/swagger-ui.html](http://localhost:8090/swagger-ui.html)

Aquí encontrarás la documentación interactiva de todos los endpoints con la posibilidad de probarlos directamente.

---

## 🔐 Credenciales por Defecto

El sistema incluye datos de prueba (solo en perfil `dev`):

| Rol       | Correo                        | Contraseña  |
|-----------|-------------------------------|-------------|
| **ADMIN** | admin@academia.ud             | Admin123*   |
| **PROFESOR** | maria.gonzalez@academia.ud | Prof123*    |
| **PROFESOR** | carlos.rodriguez@academia.ud | Prof123*  |
| **ACUDIENTE** | ana.martinez@correo.com    | Acud123*    |

---

## 📡 Casos de Uso Implementados (18 Total)

### **1. Autenticación (2 C.U)**
- `POST /api/auth/login` → **C.U 25** Login
- `POST /api/auth/first-login` → **C.U 26** Primer login con cambio de contraseña

### **2. Gestión de Usuarios (4 C.U)**
- `POST /api/usuarios` → **C.U 17** Crear usuario
- `PUT /api/usuarios/{id}` → **C.U 17.1** Actualizar usuario
- `GET /api/usuarios/page` → **C.U 18** Listar usuarios paginados
- `PATCH /api/usuarios/{id}/estado` → **C.U 20** Habilitar/deshabilitar usuario

### **3. Gestión de Aspirantes (3 C.U)**
- `POST /api/aspirantes` → **C.U 28** Crear aspirante (mínimo 1 estudiante)
- `PATCH /api/aspirantes/{id}/estado` → **C.U 30** Cambiar estado aspirante
- `PUT /api/aspirantes/{id}/entrevista` → **C.U 31** Agendar entrevista

### **4. Gestión de Grupos (3 C.U)**
- `POST /api/grupos` → **C.U 32** Crear grupo (estado BORRADOR)
- `PATCH /api/grupos/{id}/confirmar` → **C.U 33** Confirmar grupo (ACTIVO)
- `GET /api/grupos/{id}/listado.pdf` → **C.U 34** Generar listado PDF

### **5. Gestión de Citaciones (4 C.U)**
- `POST /api/citaciones` → **C.U 1** Crear citación (INDIVIDUAL/GRUPAL/ASPIRANTE)
- `GET /api/citaciones?tipo=GRUPAL` → **C.U 2** Listar citaciones grupales
- `GET /api/citaciones?tipo=INDIVIDUAL` → **C.U 4** Listar citaciones individuales
- `GET /api/citaciones?tipo=ASPIRANTE` → **C.U 5** Listar citaciones aspirantes

### **6. Gestión de Calificaciones (4 C.U)**
- `GET /api/calificaciones?estudianteId=1&periodo=1` → **C.U 7** Consultar calificaciones
- `GET /api/calificaciones/reporte/boletin?estudianteId=1` → **C.U 8** Generar boletín PDF
- `POST /api/calificaciones` → **C.U 9** Crear calificación (1.0-5.0)
- `PUT /api/calificaciones/{id}` → **C.U 10** Modificar calificación

---

## 🧪 Pruebas con Postman

### Importar la Colección

1. Abrir Postman
2. Click en **Import**
3. Seleccionar el archivo `postman/FASE1.postman_collection.json`
4. La colección incluye todos los 18 casos de uso organizados por módulos

### Flujo de Prueba Recomendado

1. **Login como Admin** → Guardar token automáticamente
2. **Crear Usuario** → Obtener credenciales temporales
3. **Crear Aspirante** → Con al menos 1 estudiante
4. **Cambiar Estado Aspirante** → A REVISADO o ESPERA_ENTREVISTA
5. **Crear Grupo** → En estado BORRADOR
6. **Confirmar Grupo** → Cambiar a ACTIVO
7. **Crear Calificación** → Para un estudiante
8. **Generar PDFs** → Listado y Boletín

---

## 🔒 Seguridad JWT

- **Algoritmo:** HS512
- **Duración Access Token:** 24 horas
- **Duración Refresh Token:** 7 días
- **Encoder:** BCrypt con 12 rounds

### Usar Token en Requests

En Postman o herramientas similares:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 📦 Reglas de Negocio Implementadas

1. ✅ Solo **ADMIN** puede crear/deshabilitar usuarios
2. ✅ Primer login obliga cambio de contraseña
3. ✅ Aspirante requiere mínimo 1 estudiante
4. ✅ Estado inicial aspirante: **SIN_REVISAR**
5. ✅ Grupo sin estudiantes queda en **BORRADOR**
6. ✅ Capacidad máxima de grupo: **20 estudiantes**
7. ✅ Citación **INDIVIDUAL**: 1 acudiente + 1 profesor
8. ✅ Citación **GRUPAL**: N acudientes + 1 profesor
9. ✅ Citación **ASPIRANTE**: 1 aspirante + 1 admin
10. ✅ Calificación entre **1.0 y 5.0**
11. ✅ Solo **PROFESOR** crea/modifica calificaciones

---

## 🐛 Solución de Problemas

### Error de conexión a MySQL

```
Verificar que MySQL esté corriendo:
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

### Puerto 8080 ocupado

Cambiar puerto en `application.properties`:
```properties
server.port=8081
```

### Error de compilación con MapStruct

```bash
mvn clean install -U
```

---

## 📄 Licencia

Proyecto académico - Universidad Distrital - Todos los derechos reservados.

---

## 👥 Contacto

Para soporte técnico o consultas:
- Email: soporte@academia.ud
- Swagger UI: http://localhost:8090/swagger-ui.html

---

## ✅ Checklist de Verificación

- [x] Compilación sin errores con `mvn clean install`
- [x] Ejecución exitosa con `mvn spring-boot:run`
- [x] Swagger accesible en http://localhost:8090/swagger-ui.html
- [x] Login admin funcional
- [x] 18 endpoints REST operativos
- [x] Generación de PDFs funcionando
- [x] Base de datos MySQL configurada (prod)
- [x] H2 Console accesible (dev): http://localhost:8090/h2-console

---

**Versión:** 1.0.0  
**Fecha:** Diciembre 2025  
**Framework:** Spring Boot 3.2.5  
**Java:** 17
