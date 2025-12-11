# Panel de Calificaciones del Profesor - Documentación

## Descripción General
Componente completo de React que permite a los profesores gestionar calificaciones de sus estudiantes, con validaciones en tiempo real, auto-guardado, preview de boletín y descarga de PDF.

## Estructura de Archivos

```
frontend/src/pages/
├── ProfesorCalificaciones.jsx       # Componente principal
├── ProfesorCalificaciones.module.css # Estilos CSS Module
└── Profesor/
    ├── Calificaciones.jsx            # (Opcional) Versión standalone
    └── Calificaciones.module.css     # (Opcional) Estilos standalone
```

## Componentes Internos

### 1. **ProfesorCalificaciones** (Componente Principal)
- **Responsabilidad**: Orquestación general del flujo de calificaciones
- **Estados principales**:
  - `grupos[]`: Grupos asignados al profesor
  - `estudiantes[]`: Estudiantes del grupo seleccionado
  - `logrosConCalif[]`: Logros combinados con calificaciones existentes
  - `periodo`: Periodo académico (1-4)
  - `loading`, `saving`, `downloading`: Estados de operaciones

### 2. **FilaCalificacion**
- **Props**: `logro, periodo, estudianteId, onSave, onDelete, saving`
- **Funcionalidad**:
  - Input numérico con validación 1.0-5.0 (step 0.1)
  - Auto-guardado al perder foco (`onBlur`)
  - Validación con Zod en tiempo real
  - Acciones: Guardar, Editar, Eliminar
- **Validación**: `calificacionSchema` con refinamiento para 1 decimal

### 3. **TablaCalificaciones**
- **Props**: `logros, periodo, estudianteId, onSave, onDelete, onSaveAll, saving, savingId`
- **Estructura**:
  - Tabla con columnas: Logro, Categoría, Periodo, Nota, Acciones
  - Botón sticky footer "Guardar todos los cambios"
  - Loading spinner por fila individual

### 4. **PreviewBoletin**
- **Props**: `calificaciones, estudiante, periodo, onDownload, downloading`
- **Funcionalidad**:
  - Cálculo automático de promedio: `AVG(notasValidas)`
  - Mini-tabla con scroll (max-height: 50vh)
  - Botón de descarga PDF con icono dinámico
  - Sticky positioning para seguir scroll

### 5. **PaginationEstudiante**
- **Props**: `estudiantes, currentIndex, onChange`
- **Navegación**: Botones "← Anterior" y "Siguiente →"
- **Info**: Muestra "X de Y" estudiantes

### 6. **ModalConfirmDelete**
- **Props**: `isOpen, onConfirm, onCancel, logroNombre`
- **Overlay**: Fondo oscuro semitransparente
- **Acciones**: Cancelar (gris) y Eliminar (rojo)

### 7. **SpinnerLocal**
- **Props**: `size` ('small' | 'medium')
- **Animación**: Rotación CSS con `@keyframes spin`

## Flujo de Datos

### Carga Inicial
```
1. useEffect() → cargarGrupos()
   └─> GET /grupos?profesorId={userId}
       └─> setGrupos(response.data)

2. Usuario selecciona grupo → cargarEstudiantes()
   └─> GET /estudiantes?grupoId={grupoId}
       └─> setEstudiantes(response.data)
       └─> Auto-selecciona primer estudiante

3. Usuario selecciona estudiante/periodo → cargarLogrosYCalificaciones()
   ├─> GET /logros?grado={gradoGrupo}
   ├─> GET /calificaciones?estudianteId={id}&periodo={p}
   └─> Combina ambos en logrosConCalif[]
```

### Guardado de Calificaciones

#### Guardado Individual (auto-save onBlur)
```
handleSave()
├─> Validación Zod: calificacionSchema.safeParse({ nota })
├─> Si calificacionId existe:
│   └─> PUT /calificaciones/{id} { nota }
└─> Si no existe:
    └─> POST /calificaciones { estudianteId, logroId, periodo, nota }
└─> Recargar: cargarLogrosYCalificaciones()
└─> toast.success()
```

#### Guardado Batch (botón "Guardar todos")
```
handleSaveAll()
├─> Filtrar logros con nota válida
├─> Promise.all() para cada logro:
│   ├─> Validar con Zod
│   └─> PUT o POST según calificacionId
└─> toast.success() o toast.error()
└─> Recargar calificaciones
```

### Eliminación
```
handleDeleteCalificacion(logro)
└─> Abrir modal confirmación

confirmDelete()
├─> DELETE /calificaciones/{calificacionId}
└─> toast.success()
└─> Recargar calificaciones
```

### Descarga PDF
```
handleDownloadPDF()
├─> GET /calificaciones/reporte/boletin.pdf?estudianteId={id}&periodo={p}
│   └─> responseType: 'blob'
├─> Crear Blob URL
├─> Trigger download con <a> element
├─> Filename: boletin_{nombre}_periodo{p}.pdf
└─> toast.success()
```

## Validaciones

### Schema Zod
```javascript
const calificacionSchema = z.object({
  nota: z.number()
    .min(1.0, 'La nota mínima es 1.0')
    .max(5.0, 'La nota máxima es 5.0')
    .refine((val) => {
      const decimal = (val * 10) % 10;
      return decimal === 0;
    }, 'Solo se permite un decimal')
});
```

### Validación en Input
- **Atributos HTML**: `type="number"`, `step="0.1"`, `min="1.0"`, `max="5.0"`
- **OnChange**: Actualiza estado, limpia errores
- **OnBlur**: Valida y auto-guarda si válido
- **Error display**: Texto rojo debajo del input

## Endpoints Backend Requeridos

### Grupos
```
GET /api/grupos?profesorId={id}
Response: Array<{ id, nombre, grado, profesor, estudiantes[] }>
```

### Estudiantes
```
GET /api/estudiantes?grupoId={id}
Response: Array<{ id, nombre, apellido, grado }>
```

### Logros
```
GET /api/logros?grado={grado}
Response: Array<{ id, nombre, descripcion, categoria, grado }>
```

### Calificaciones
```
GET /api/calificaciones?estudianteId={id}&periodo={p}
Response: Array<{ id, logroId, nota, periodo, estudianteId }>

POST /api/calificaciones
Body: { estudianteId, logroId, periodo, nota }
Response: { id, ...body }

PUT /api/calificaciones/{id}
Body: { nota }
Response: { id, nota, ...updated }

DELETE /api/calificaciones/{id}
Response: 204 No Content
```

### Reporte PDF
```
GET /api/calificaciones/reporte/boletin.pdf?estudianteId={id}&periodo={p}
Response: application/pdf (blob)
```

## Características de UX

### Responsividad
- **Desktop (>1200px)**: Grid 2 columnas (tabla + preview)
- **Tablet (768-1200px)**: Grid 1 columna, preview debajo
- **Mobile (<768px)**:
  - Filtros en columna
  - Tabla con scroll horizontal
  - Inputs más pequeños (70px)
  - Acciones en columna

### Feedback Visual
- **Toast notifications**: react-hot-toast en todas las operaciones
- **Loading states**:
  - Spinner grande: carga inicial
  - Spinner pequeño: guardado por fila
  - Botón disabled con texto "Guardando..."
- **Hover effects**: Filas de tabla con bg #f9fafb
- **Focus states**: Outline azul en inputs/botones

### Accesibilidad
- **Labels**: `htmlFor` en todos los selects
- **ARIA**: `aria-label` en botones de iconos
- **Focus visible**: Outline 2px en elementos interactivos
- **Reduced motion**: Respeta `prefers-reduced-motion`

## Estilos CSS Module

### Variables de Color (implícitas)
```css
--primary: #3b82f6 (azul)
--success: #10b981 (verde)
--warning: #f59e0b (naranja)
--danger: #ef4444 (rojo)
--gray: #6b7280
--grayBorder: #e5e7eb
```

### Clases Principales
- `.container`: Padding 2rem, max-width 1600px
- `.filtros`: Flex wrap, gap 1rem, background blanco
- `.tabla`: width 100%, border-collapse, font-size 0.875rem
- `.inputNota`: width 80px, text-align right, border radius 6px
- `.stickyFooter`: position sticky bottom 0, shadow superior
- `.previewBoletin`: sticky top 2rem, max-height 80vh

### Animación
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Dependencias

### Instaladas
```json
{
  "react": "^18.0.0",
  "react-hot-toast": "^2.4.1",
  "zod": "^3.22.0",
  "axios": "^1.6.0"
}
```

### Servicios
- `../services/api`: Axios con interceptor JWT Bearer
- `../components/common/Layout`: Wrapper con sidebar y navbar

## Testing Manual

### Caso de Prueba 1: Flujo Completo
1. Login como profesor (profesor1@academia.ud / Prof123*)
2. Navegar a /profesor/calificaciones
3. Seleccionar grupo "Grado Primero A"
4. Seleccionar estudiante "Juan Pérez"
5. Seleccionar Periodo 1
6. Ingresar nota 4.5 en primer logro → Auto-guarda al perder foco
7. Click "Guardar todos los cambios"
8. Cambiar a Periodo 2 → Debe limpiar calificaciones
9. Click "Descargar Boletín" → Descarga PDF

### Caso de Prueba 2: Validaciones
1. Ingresar nota 6.0 → Error "La nota máxima es 5.0"
2. Ingresar nota 0.5 → Error "La nota mínima es 1.0"
3. Ingresar nota 3.45 → Error "Solo se permite un decimal"
4. Ingresar nota vacía → No guarda automáticamente

### Caso de Prueba 3: Navegación
1. Seleccionar grupo con 5 estudiantes
2. Click "Siguiente" 4 veces → Debe llegar al último
3. Botón "Siguiente" deshabilitado
4. Click "Anterior" → Vuelve al estudiante 4
5. Cambiar desde select → Actualiza paginación

### Caso de Prueba 4: Eliminación
1. Calificar logro con 4.0
2. Click icono 🗑
3. Modal confirma eliminación
4. Click "Eliminar" → Toast success
5. Nota desaparece de la tabla

## Troubleshooting

### Problema: "No se pudo obtener información del usuario"
**Causa**: Token JWT inválido o expirado
**Solución**: Verificar `localStorage.getItem('token')`, re-login

### Problema: Calificaciones no se guardan
**Causa**: Endpoint backend no disponible
**Solución**: Verificar backend en puerto 8090, revisar console.error

### Problema: PDF no descarga
**Causa**: CORS o endpoint PDF no implementado
**Solución**: Verificar headers CORS, implementar endpoint con responseType blob

### Problema: Validación falla con 4.0
**Causa**: Refine del decimal mal implementado
**Solución**: Verificar `(val * 10) % 10 === 0` acepta .0

### Problema: Preview no actualiza
**Causa**: Estado `logrosConCalif` no se recarga
**Solución**: Llamar `cargarLogrosYCalificaciones()` después de guardar

## Mejoras Futuras

1. **Offline support**: LocalStorage cache de calificaciones
2. **Bulk operations**: Copiar calificaciones de periodo anterior
3. **Keyboard shortcuts**: Enter para guardar, Tab para siguiente
4. **Export Excel**: Además del PDF
5. **Comentarios**: Campo de observaciones por logro
6. **Historial**: Ver cambios de calificaciones
7. **Notificaciones**: Email al acudiente cuando se publican calificaciones
8. **Estadísticas**: Gráfico de distribución de notas

## Créditos
Desarrollado siguiendo las especificaciones del PROMPT EXHAUSTIVO – PANEL DE CALIFICACIONES DEL PROFESOR.
Cumple con casos de uso C.U 7, 8, 9, 10 del sistema de gestión académica.
