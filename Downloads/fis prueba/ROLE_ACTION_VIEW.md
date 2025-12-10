# FASE 4 – CARTA DE NAVEGACIÓN ROL-ACTION-VISTA

## ADMIN

### Vista: /admin/usuarios
- **Listar usuarios paginado** → `GET /api/usuarios/page?page=&size=`
- **Crear usuario** → `POST /api/usuarios` (Modal)
- **Editar usuario** → `PUT /api/usuarios/{id}` (Modal)
- **Cambiar estado** → `PATCH /api/usuarios/{id}/estado` (Toggle activo/inactivo)

### Vista: /admin/grupos
- **Listar grupos paginado** → `GET /api/grupos?page=&size=`
- **Crear grupo** → `POST /api/grupos` (Modal)
- **Confirmar grupo** → `PATCH /api/grupos/{id}/confirmar` (Botón naranja, BORRADOR → ACTIVO)
- **Descargar listado PDF** → `GET /api/grupos/{id}/listado.pdf` (Botón naranja)

### Vista: /admin/aspirantes
- **Listar aspirantes paginado** → `GET /api/aspirantes?page=&size=&estado=` (Filtro estado)
- **Aprobar aspirante** → `PATCH /api/aspirantes/{id}/estado` (Badge → "APROBADO")
- **Rechazar aspirante** → `PATCH /api/aspirantes/{id}/estado` (Badge → "NO_APROBADO")
- **Agendar entrevista** → `PUT /api/aspirantes/{id}/entrevista?fecha=` (Modal calendario)

### Vista: /admin/citaciones
- **Listar citaciones paginado** → `GET /api/citaciones?page=&size=&tipo=` (Filtro tipo)
- **Crear citación individual** → `POST /api/citaciones` (Modal, tipo: INDIVIDUAL)
- **Crear citación grupal** → `POST /api/citaciones` (Modal multi-select, tipo: GRUPAL)
- **Crear citación aspirante** → `POST /api/citaciones` (Modal auto-llena aspirante, tipo: ASPIRANTE)
- **Cambiar estado cita** → `PATCH /api/citaciones/{id}/estado` (Select interno)

---

## PROFESOR

### Vista: /profesor/calificaciones
- **Seleccionar grupo** → `GET /api/grupos?profesorId=` (Select dropdown)
- **Seleccionar estudiante** → `GET /api/estudiantes?grupoId=` (Select dropdown)
- **Listar logros del estudiante** → `GET /api/calificaciones?estudianteId=&periodo=` (Tabla)
- **Crear calificación** → `POST /api/calificaciones` (Input por fila)
- **Editar calificación** → `PUT /api/calificaciones/{id}` (Input inline)

### Vista: /profesor/listado-estudiantes
- **Seleccionar grupo** → `GET /api/grupos?profesorId=` (Select dropdown)
- **Listar estudiantes del grupo** → `GET /api/estudiantes?grupoId=` (Tabla con regCivil, nombre, grado, acudiente)
- **Descargar listado PDF** → `GET /api/grupos/{id}/listado.pdf` (Botón naranja)

### Vista: /profesor/observador
- **Seleccionar grupo** → `GET /api/grupos?profesorId=` (Select dropdown)
- **Seleccionar estudiante** → `GET /api/grupos/{id}` (obtiene estudiantes del grupo)
- **Listar observaciones estudiante** → `GET /api/observaciones?estudianteId=` (Cards con colores por tipo)
- **Agregar observación** → `POST /api/observaciones` (Formulario con fecha, tipo dropdown, descripción textarea)

### Vista: /profesor/grupos
- **Ver grupos asignados** → `GET /api/grupos?profesorId=` (Cards con grado, nombre, estudiantes)
- **Descargar listado PDF** → `GET /api/grupos/{id}/listado.pdf` (Botón naranja por grupo)

### Vista: /profesor/citaciones
- **Listar citaciones** → `GET /api/citaciones?profesorId=` (Filtro estado, tabla)
- **Ver detalles citación** → Despliega info completa en card

---

## ACUDIENTE

### Vista: /acudiente/boletin
- **Seleccionar hijo** → `GET /api/estudiantes?acudienteId=` (desde token, Select dropdown)
- **Seleccionar periodo** → `GET /api/calificaciones?estudianteId=&periodo=` (Select dropdown)
- **Ver boletín (tabla)** → `GET /api/calificaciones/reporte/boletin?estudianteId=&periodo=` (Preview tabla)
- **Descargar boletín PDF** → `GET /api/calificaciones/reporte/boletin.pdf?estudianteId=&periodo=` (Botón naranja)

### Vista: /acudiente/observador
- **Seleccionar hijo** → `GET /api/estudiantes?acudienteId=` (Select dropdown)
- **Listar observaciones hijo** → `GET /api/observaciones?estudianteId=` (Cards read-only con fecha, tipo badge, descripción, profesor)

### Vista: /acudiente/citaciones (notificaciones)
- **Ver citaciones recibidas** → `GET /api/citaciones?acudienteId=` (desde token, Lista con filtro estado)
- **Filtrar por estado** → TODAS | PENDIENTE | REALIZADA | CANCELADA (filtro local)

---

## ASPIRANTE

### Vista: /pre-inscripcion (pública, sin autenticación)
- **Enviar pre-inscripción** → `POST /api/aspirantes` (Form grande: acudiente + multi-estudiantes con grados)
- **Agregar estudiante** → Botón que agrega campo estudiante al formulario
- **Eliminar estudiante** → Botón que elimina campo estudiante (mínimo 1)

### Vista: /aspirante/estado (protegida, rol ASPIRANTE)
- **Consultar estado** → `GET /api/aspirantes?usuarioId=` (desde token, Card con badge estado)
- **Ver fecha entrevista** → Mostrar fecha si estado es ESPERA_ENTREVISTA
- **Ver estudiantes pre-inscritos** → Lista de estudiantes con nombre, grado

---

## RESUMEN DE ENDPOINTS POR CONTROLADOR

### UsuarioController
- `GET /api/usuarios/page` - Paginación
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/{id}` - Actualizar
- `PATCH /api/usuarios/{id}/estado` - Cambiar estado

### GrupoController
- `GET /api/grupos` - Listar (con filtros opcionales)
- `GET /api/grupos?profesorId=` - Grupos de un profesor
- `GET /api/grupos/{id}` - Obtener uno con estudiantes
- `POST /api/grupos` - Crear
- `PATCH /api/grupos/{id}/confirmar` - Confirmar
- `GET /api/grupos/{id}/listado.pdf` - PDF listado

### AspiranteController
- `GET /api/aspirantes` - Listar (con filtros)
- `POST /api/aspirantes` - Crear pre-inscripción
- `PATCH /api/aspirantes/{id}/estado` - Cambiar estado
- `PUT /api/aspirantes/{id}/entrevista` - Agendar entrevista

### CitacionController
- `GET /api/citaciones` - Listar (con filtros acudienteId, profesorId, tipo)
- `GET /api/citaciones/page` - Paginado
- `POST /api/citaciones` - Crear (individual/grupal/aspirante)
- `PATCH /api/citaciones/{id}/estado` - Cambiar estado

### CalificacionController
- `GET /api/calificaciones` - Listar por estudiante y periodo
- `POST /api/calificaciones` - Crear
- `PUT /api/calificaciones/{id}` - Actualizar
- `GET /api/calificaciones/reporte/boletin` - Vista previa
- `GET /api/calificaciones/reporte/boletin.pdf` - Descarga PDF

### ObservacionController
- `GET /api/observaciones` - Listar por estudianteId
- `POST /api/observaciones` - Crear observación

### EstudianteController
- `GET /api/estudiantes` - Listar (con filtros acudienteId, grupoId)
- `GET /api/estudiantes/{id}` - Obtener uno

### LogroController
- `GET /api/logros` - Listar todos
- `GET /api/logros/categoria/{categoria}` - Por categoría
- `POST /api/logros` - Crear
- `PUT /api/logros/{id}` - Actualizar

---

## NOTAS TÉCNICAS

### Autenticación
- JWT Bearer Token en header `Authorization`
- Token guardado en localStorage
- Interceptor en axios agrega token automáticamente

### Roles
- `ADMIN` - Acceso completo
- `PROFESOR` - Gestión académica y observador
- `ACUDIENTE` - Consulta boletín, observador, citaciones
- `ASPIRANTE` - Pre-inscripción y consulta estado

### Seguridad Backend
- `@PreAuthorize` en endpoints
- CORS habilitado para localhost:5173 y localhost:5174
- Contraseñas encriptadas con BCrypt

### Frontend
- React 19.2.0 + Vite 7.2.7
- React Router DOM para rutas protegidas
- Axios para peticiones HTTP
- CSS Modules para estilos
