# 📋 Flujo Simplificado de Pre-inscripción de Aspirantes

## 🎯 Resumen

Este documento describe el **flujo ultra-simple** de pre-inscripción para aspirantes, que elimina pasos intermedios innecesarios y permite a cualquier persona completar el proceso en **2 pantallas**:

1. **Formulario de Pre-inscripción** → Llena datos y recibe clave temporal
2. **Estado de Inscripción** → Consulta estado, datos del estudiante y fecha de entrevista

**Sin registro previo. Sin cambio de contraseña. Sin autenticación JWT.**

---

## 🚀 Características Principales

✅ **Formulario público** sin necesidad de autenticación  
✅ **Generación automática** de usuario aspirante y clave temporal  
✅ **Validación robusta** con React Hook Form + Zod  
✅ **Modal elegante** para mostrar y copiar clave temporal  
✅ **Consulta de estado** sin autenticación (solo con ID en localStorage)  
✅ **CSS Modules** para estilos aislados y mantenibles  
✅ **Responsive** y accesible (ARIA labels, focus states)

---

## 📁 Estructura de Archivos

### Frontend
```
frontend/src/pages/Aspirante/
├── Preinscripcion.jsx               # Formulario de pre-inscripción
├── Preinscripcion.module.css        # Estilos del formulario
├── ClaveTemporalModal.jsx           # Modal para mostrar clave
├── ClaveTemporalModal.module.css    # Estilos del modal
├── EstadoInscripcion.jsx            # Consulta de estado
├── EstadoInscripcion.module.css     # Estilos de estado
├── hooks/
│   └── usePreinscripcion.js         # Hook con lógica de preinscripción
└── services/
    └── aspirantePublicoService.js   # Servicio HTTP sin JWT
```

### Backend
```
src/main/java/co/udistrital/academia/
├── controller/AspiranteController.java         # Endpoints públicos
├── service/AspiranteService.java               # Lógica de negocio
└── dto/
    ├── PreinscripcionPublicaRequest.java       # DTO entrada
    ├── PreinscripcionPublicaResponse.java      # DTO salida
    └── EstadoPublicoResponse.java              # DTO estado público
```

---

## 🔄 Flujo Completo

### 1️⃣ Pre-inscripción (`/aspirante/preinscripcion`)

**Usuario accede al formulario:**
- Ruta: `http://localhost:5174/aspirante/preinscripcion`
- Pública (sin autenticación)

**Llena formulario con:**
- ✉️ Correo del acudiente (será el login)
- 👤 Nombre y apellido del acudiente
- 📱 Teléfono (10 dígitos)
- 👶 Nombre y apellido del menor
- 📚 Grado al que aspira (select: Párvulos, Caminadores, Pre-jardín)
- 📅 Fecha de nacimiento (>= 3 años)
- 💊 Alergias o condiciones médicas (opcional, textarea)

**Al enviar, el backend:**
1. Valida que el correo no esté registrado
2. Genera clave temporal de 8 caracteres alfanuméricos
3. Crea `Usuario` con rol ASPIRANTE
4. Crea `TokenUsuario` con clave temporal
5. Crea `Aspirante` con estado `SIN_REVISAR`
6. Crea `Estudiante` vinculado al aspirante
7. Devuelve: `{ claveTemporal, aspiranteId, estudianteId }`

**Frontend muestra modal con:**
- 🔑 Clave temporal en caja destacada
- 📋 Botón "Copiar" (usa `navigator.clipboard`)
- ➡️ Botón "Ver estado de inscripción"

**Datos guardados en localStorage:**
```javascript
localStorage.setItem('claveTemporal', '...');
localStorage.setItem('aspiranteId', '...');
localStorage.setItem('estudianteId', '...');
```

---

### 2️⃣ Estado de Inscripción (`/aspirante/estado`)

**Usuario navega a:**
- Ruta: `http://localhost:5174/aspirante/estado`
- Pública (sin autenticación)

**Componente carga automáticamente:**
```javascript
const aspiranteId = localStorage.getItem('aspiranteId');
```

**Si no hay `aspiranteId` → redirige a `/aspirante/preinscripcion`**

**Backend devuelve:**
```json
{
  "estado": "Sin revisar" | "Espera entrevista" | "Aprobado",
  "fechaEntrevista": "2025-09-30" | null,
  "estudiante": {
    "nombre": "María",
    "apellido": "Pérez",
    "grado": "Párvulos",
    "fechaNacimiento": "2020-05-15"
  }
}
```

**Frontend muestra:**
- 🎯 **Badge de estado** (color según estado)
- 👶 **Datos del estudiante** (tabla limpia)
- 📅 **Fecha de entrevista** (si existe, con icono de calendario)
- ℹ️ **Mensaje informativo** según el estado
- 🔙 **Botón "Volver al inicio"**

---

## 🛠️ Endpoints Backend

### POST `/api/aspirantes/preinscripcion-publica`

**Descripción:** Crea preinscripción sin autenticación

**Body:**
```json
{
  "correo": "padre@ejemplo.com",
  "nombreAcudiente": "Juan",
  "apellidoAcudiente": "Pérez",
  "telefono": "3001234567",
  "nombreMenor": "María",
  "apellidoMenor": "Pérez",
  "grado": "Párvulos",
  "fechaNacimiento": "2020-05-15",
  "alergias": "Alergia a la leche"
}
```

**Response 201:**
```json
{
  "claveTemporal": "A3bC9xZ2",
  "aspiranteId": 15,
  "estudianteId": 42
}
```

**Validaciones:**
- Correo único (no registrado previamente)
- Teléfono: exactamente 10 dígitos
- Nombres/apellidos: 3-50 caracteres
- Fecha de nacimiento: menor >= 3 años

---

### GET `/api/aspirantes/{id}/estado-publico`

**Descripción:** Consulta estado sin autenticación

**Params:**
- `id` (path): ID del aspirante

**Response 200:**
```json
{
  "estado": "Sin revisar",
  "fechaEntrevista": null,
  "estudiante": {
    "nombre": "María",
    "apellido": "Pérez",
    "grado": "Párvulos",
    "fechaNacimiento": "2020-05-15"
  }
}
```

**Seguridad:**
- ✅ Público (sin JWT)
- ✅ Configurado en `SecurityConfig.java`

---

## 🎨 Diseño y Estilos

### Variables CSS (`:root`)
```css
--primary: #0F1A30;      /* Azul oscuro */
--accent: #FA761B;       /* Naranja */
--bgPage: #F7F9FC;       /* Fondo claro */
--white: #FFFFFF;        /* Blanco */
--grayBorder: #E5E7EB;   /* Bordes sutiles */
--grayText: #6B7280;     /* Texto secundario */
--success: #10B981;      /* Verde éxito */
--warning: #F59E0B;      /* Naranja advertencia */
--error: #DC2626;        /* Rojo error */
--radius: 8px;           /* Bordes redondeados */
--shadow: 0 4px 12px rgba(0,0,0,.08); /* Sombra suave */
```

### Componentes Principales

**`.formCard`** → Tarjeta centrada con formulario  
**`.badge`** → Badge de estado con colores dinámicos  
**`.modalOverlay`** → Fondo oscuro semitransparente  
**`.modalContent`** → Modal centrado con animación  
**`.dataTable`** → Tabla limpia con filas alternadas  
**`.btnPrimary`** → Botón principal naranja con hover  
**`.btnSecondary`** → Botón secundario con borde

---

## ✅ Validaciones del Formulario (Zod)

```javascript
const preinscripcionSchema = z.object({
  correo: z.string()
    .min(1, 'El correo es obligatorio')
    .email('Correo electrónico inválido'),
  
  nombreAcudiente: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  
  telefono: z.string()
    .regex(/^\d{10}$/, 'Debe tener 10 dígitos'),
  
  grado: z.enum(['Párvulos', 'Caminadores', 'Pre-jardín']),
  
  fechaNacimiento: z.string()
    .refine((fecha) => {
      const edad = calcularEdad(fecha);
      return edad >= 3;
    }, 'El menor debe tener al menos 3 años'),
  
  alergias: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional()
});
```

---

## 🧪 Pruebas Manuales

### Test 1: Crear Pre-inscripción Exitosa
1. Ir a `http://localhost:5174/aspirante/preinscripcion`
2. Llenar formulario con datos válidos
3. Click "Enviar Pre-inscripción"
4. **✅ Verificar:** Modal muestra clave temporal
5. Click "Copiar" → Verificar clave en portapapeles
6. Click "Ver Estado de Inscripción"
7. **✅ Verificar:** Redirige a `/aspirante/estado`
8. **✅ Verificar:** Muestra datos del estudiante y badge "Sin revisar"

### Test 2: Validaciones del Formulario
1. Dejar campos vacíos → **✅ Mensajes de error**
2. Correo inválido → **✅ "Correo electrónico inválido"**
3. Teléfono con 9 dígitos → **✅ "Debe tener 10 dígitos"**
4. Fecha de nacimiento reciente → **✅ "Debe tener al menos 3 años"**

### Test 3: Correo Duplicado
1. Crear preinscripción con correo `test@ejemplo.com`
2. Intentar crear otra con el mismo correo
3. **✅ Verificar:** Error "Ya existe un usuario con ese correo"

### Test 4: Estado sin aspiranteId
1. Borrar localStorage: `localStorage.clear()`
2. Ir a `/aspirante/estado`
3. **✅ Verificar:** Redirige a `/aspirante/preinscripcion`

---

## 🔒 Seguridad

### Configuración en `SecurityConfig.java`
```java
.requestMatchers("/api/aspirantes/preinscripcion-publica").permitAll()
.requestMatchers("/api/aspirantes/*/estado-publico").permitAll()
```

### Notas de Seguridad
- ✅ Endpoints públicos documentados con `@Operation`
- ✅ No expone información sensible (solo estado y datos del menor)
- ✅ Clave temporal encriptada con `BCrypt`
- ⚠️ **TODO:** Agregar rate limiting para prevenir spam
- ⚠️ **TODO:** Agregar CAPTCHA en formulario de preinscripción

---

## 📱 Responsive Design

### Breakpoints
- **Desktop:** `> 640px` → Formulario 2 columnas
- **Mobile:** `<= 640px` → Formulario 1 columna

### Ajustes Mobile
- Padding reducido en cards
- Font sizes ajustados
- Botones 100% width
- DataRow en columna (label arriba, value abajo)

---

## ♿ Accesibilidad

- ✅ **Labels con `htmlFor`** → Asociación correcta input-label
- ✅ **`aria-label`** en botones de acción
- ✅ **`role="dialog"`** en modal
- ✅ **`role="alert"`** en mensajes de error
- ✅ **Focus outline** visible (`2px solid var(--primary)`)
- ✅ **Contraste de colores** WCAG AA compatible

---

## 🐛 Solución de Problemas

### Error: "No se pudo cargar el estado"
**Causa:** `aspiranteId` no existe o es inválido  
**Solución:** Verificar localStorage, completar preinscripción nuevamente

### Error: "Ya existe un usuario con ese correo"
**Causa:** Correo duplicado en base de datos  
**Solución:** Usar otro correo o consultar estado con el existente

### Modal no se muestra
**Causa:** `mostrarModal` state no actualizado  
**Solución:** Verificar `enviarPreinscripcion` en hook

### Botón "Copiar" no funciona
**Causa:** Navegador no soporta Clipboard API o HTTPS requerido  
**Solución:** Usar HTTPS o navegador moderno

---

## 🚀 Próximos Pasos (Mejoras Futuras)

1. **Notificación por Email:** Enviar clave temporal al correo registrado
2. **Recuperación de Clave:** Endpoint para solicitar nueva clave si se pierde
3. **Panel Admin:** Vista para admin gestionar preinscripciones pendientes
4. **Subir Documentos:** Permitir adjuntar registro civil del menor
5. **Pago Online:** Integrar pasarela de pago para matrícula
6. **Calendario Interactivo:** Seleccionar fecha de entrevista desde frontend
7. **Recordatorios SMS:** WhatsApp/SMS antes de entrevista
8. **Dashboard Padre:** Portal autenticado con más información

---

## 📞 Contacto y Soporte

- **Desarrollador:** FIS Academia Team
- **Repositorio:** `fis prueba/`
- **Backend:** Puerto 8090
- **Frontend:** Puerto 5174

---

## 📄 Licencia

Este proyecto es parte del sistema académico FIS y su uso está restringido al contexto educativo de la institución.

---

**✨ ¡Flujo simplificado implementado exitosamente! ✨**
