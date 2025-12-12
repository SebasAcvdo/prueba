# CHECKLIST DE ACCIONES - TESTING MANUAL

## ✅ ADMIN

### /admin/usuarios
- [ ] Ver lista paginada de usuarios
- [ ] Crear usuario nuevo (modal abre correctamente)
- [ ] Editar usuario existente (modal pre-carga datos)
- [ ] Activar/Desactivar usuario (toggle cambia color)
- [ ] Navegar entre páginas (paginación funciona)

### /admin/grupos
- [ ] Ver lista de grupos con cards
- [ ] Crear grupo nuevo (modal con selector de profesor)
- [ ] Confirmar grupo BORRADOR → ACTIVO (botón naranja)
- [ ] Descargar PDF de listado de estudiantes (botón naranja)
- [ ] Ver cantidad de estudiantes por grupo

### /admin/aspirantes
- [ ] Ver lista de aspirantes con badges de estado
- [ ] Filtrar por estado (dropdown funciona)
- [ ] Aprobar aspirante (badge cambia a APROBADO)
- [ ] Rechazar aspirante (badge cambia a NO_APROBADO)
- [ ] Agendar entrevista (modal calendario, selecciona fecha)
- [ ] Ver fecha de entrevista agendada

### /admin/citaciones
- [ ] Ver lista de citaciones con filtro tipo
- [ ] Crear citación individual (modal, select acudiente)
- [ ] Crear citación grupal (modal, multi-select acudientes)
- [ ] Crear citación aspirante (modal, auto-completa aspirante)
- [ ] Cambiar estado citación (PENDIENTE/REALIZADA/CANCELADA)
- [ ] Ver detalles de citación (fecha, descripción, participantes)

---

## ✅ PROFESOR

### /profesor/calificaciones
- [ ] Seleccionar grupo del dropdown (carga mis grupos)
- [ ] Seleccionar estudiante del grupo
- [ ] Ver tabla de logros con calificaciones
- [ ] Crear calificación nueva (input por fila)
- [ ] Editar calificación existente (input inline)
- [ ] Selector de periodo funciona (Periodo 1, 2, 3, 4)

### /profesor/listado-estudiantes
- [ ] Seleccionar grupo del dropdown
- [ ] Ver tabla con: regCivil, nombre, grado, acudiente, estado
- [ ] Descargar PDF del listado (botón naranja)
- [ ] PDF se descarga correctamente con datos del grupo

### /profesor/observador
- [ ] Seleccionar grupo del dropdown
- [ ] Seleccionar estudiante del grupo
- [ ] Ver historial de observaciones (cards con colores por tipo)
- [ ] Agregar observación nueva:
  - [ ] Fecha funciona
  - [ ] Selector de tipo (ACADEMICA/DISCIPLINARIA/CONVIVENCIA/LOGRO_DESTACADO)
  - [ ] Textarea descripción acepta texto largo
  - [ ] Botón guardar crea observación
- [ ] Nueva observación aparece en el historial
- [ ] Colores de cards según tipo:
  - ACADEMICA: azul
  - DISCIPLINARIA: rojo
  - CONVIVENCIA: amarillo
  - LOGRO_DESTACADO: verde

### /profesor/grupos
- [ ] Ver cards de grupos asignados
- [ ] Ver cantidad de estudiantes por grupo
- [ ] Descargar PDF listado por grupo (botón en cada card)

### /profesor/citaciones
- [ ] Ver lista de citaciones donde participo
- [ ] Filtrar por estado (TODAS/PENDIENTE/REALIZADA/CANCELADA)
- [ ] Ver detalles completos en card

---

## ✅ ACUDIENTE

### /acudiente/boletin
- [ ] Seleccionar hijo del dropdown (carga mis hijos)
- [ ] Seleccionar periodo (Periodo 1, 2, 3, 4)
- [ ] Ver tabla con calificaciones por logro
- [ ] Descargar boletín en PDF (botón naranja)
- [ ] PDF se genera correctamente con datos del estudiante

### /acudiente/observador
- [ ] Seleccionar hijo del dropdown
- [ ] Ver observaciones del hijo (cards read-only)
- [ ] Ver fecha, tipo, descripción, nombre del profesor
- [ ] Colores de cards coinciden con tipo de observación
- [ ] No hay botones de edición (solo lectura)

### /acudiente/citaciones
- [ ] Ver lista de citaciones recibidas
- [ ] Filtrar por estado (TODAS/PENDIENTE/REALIZADA/CANCELADA)
- [ ] Ver fecha, hora, descripción de cada citación
- [ ] Ver quién creó la citación (profesor o admin)
- [ ] Badge de estado tiene color correcto

---

## ✅ ASPIRANTE

### /pre-inscripcion (página pública)
- [ ] Acceder sin login desde link en /login
- [ ] Formulario de acudiente (nombre, correo)
- [ ] Agregar estudiante (botón "+")
- [ ] Formulario de estudiante (nombre, apellido, fechaNacimiento, grado)
- [ ] Eliminar estudiante (botón "x", mínimo 1)
- [ ] Selector de grado con opciones: Jardín, Transición, Primero, Segundo, Tercero, Cuarto, Quinto
- [ ] Validación: no permite enviar sin acudiente
- [ ] Validación: requiere mínimo 1 estudiante
- [ ] Botón enviar crea aspirante
- [ ] Redirecciona a /login con mensaje de éxito

### /aspirante/estado (página protegida)
- [ ] Login con credencial aspirante funciona
- [ ] Ver badge de estado con color:
  - SIN_REVISAR: gris
  - REVISADO: azul
  - ESPERA_ENTREVISTA: amarillo
  - APROBADO: verde
  - NO_APROBADO: rojo
- [ ] Si estado = ESPERA_ENTREVISTA, ver fecha de entrevista
- [ ] Ver lista de estudiantes pre-inscritos con nombre y grado
- [ ] Ver información de contacto para ayuda

---

## ✅ NAVEGACIÓN Y AUTENTICACIÓN

### Login
- [ ] Form de login funciona
- [ ] Credenciales correctas redirigen a /dashboard
- [ ] Credenciales incorrectas muestran error
- [ ] Link "¿Eres nuevo? Registra tu pre-inscripción aquí" funciona
- [ ] Logo Veritas se muestra correctamente

### Dashboard
- [ ] Sidebar muestra opciones según rol:
  - ADMIN: 4 botones (Usuarios, Aspirantes, Citaciones, Grupos)
  - PROFESOR: 5 botones (Calificaciones, Grupos, Citaciones, Listado Estudiantes, Observador)
  - ACUDIENTE: 3 botones (Boletín, Citaciones, Ver Observador)
  - ASPIRANTE: 1 botón (Consultar Estado)
- [ ] Navegación entre páginas funciona
- [ ] Botón logout funciona y redirige a /login
- [ ] Token se guarda en localStorage
- [ ] Token se envía en todas las peticiones

### Seguridad
- [ ] Rutas protegidas requieren autenticación
- [ ] Rutas de rol específico rechazan otros roles
- [ ] CORS permite peticiones desde frontend
- [ ] Backend responde correctamente en puerto 8090
- [ ] Frontend corre correctamente en puerto 5174

---

## 🔍 TESTING DE APIS DIRECTO

### Headers necesarios
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Endpoints críticos
- `POST /api/auth/login` - Genera token
- `GET /api/usuarios/page?page=0&size=10` - Paginación funciona
- `POST /api/aspirantes` - Pre-inscripción sin token
- `GET /api/observaciones?estudianteId=1` - Filtra correctamente
- `GET /api/grupos/{id}/listado.pdf` - Descarga PDF

---

## 📊 DATOS DE PRUEBA

### Usuarios
- Admin: admin@academia.ud / Admin123*
- Profesor: profesor1@academia.ud / Prof123*
- Acudiente: acudiente1@correo.com / Acud123*
- Aspirante: aspirante1@correo.com / Asp123*

### Entidades creadas por DataLoader
- 81 usuarios (1 admin, 15 profesores, 35 acudientes, 30 aspirantes)
- 20 grupos (10 ACTIVOS, 10 BORRADOR)
- 89 estudiantes
- 9 logros
- 120 calificaciones
- 50 citaciones
- 67 observaciones

---

## ❌ ERRORES COMUNES A VERIFICAR

- [ ] CORS error 403: verificar puerto en SecurityConfig.java
- [ ] 401 Unauthorized: token inválido o expirado
- [ ] 404 Not Found: ruta incorrecta en frontend
- [ ] Modal no abre: verificar estado showModal
- [ ] PDF no descarga: verificar responseType: 'blob' en axios
- [ ] Select vacío: verificar que API retorna datos
- [ ] Spinner infinito: verificar try/catch en fetchData
