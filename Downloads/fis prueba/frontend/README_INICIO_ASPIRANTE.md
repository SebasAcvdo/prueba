# README - FLUJO COMPLETO PRIMER INGRESO ASPIRANTE

## 📋 DESCRIPCIÓN GENERAL

Este documento describe el flujo completo de registro e ingreso para aspirantes en Academia UD, desde la solicitud de clave temporal hasta el envío del formulario de pre-inscripción.

## 🎯 OBJETIVO

Permitir que cualquier aspirante pueda:
1. **Registrar su correo** y recibir una clave temporal
2. **Iniciar sesión** con la clave temporal
3. **Cambiar contraseña** (obligatorio en primer ingreso)
4. **Acceder al dashboard** personalizado de aspirante
5. **Completar formulario** de pre-inscripción en 4 pasos
6. **Ver estado** de su solicitud (Sin revisar, Espera entrevista, Aprobado)

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Aspirante/
│   │   │   ├── RegistroCorreo.jsx            # Solicitud de clave temporal
│   │   │   ├── RegistroCorreo.module.css
│   │   │   ├── ClaveTemporalPopup.jsx        # Modal con clave generada
│   │   │   ├── ClaveTemporalPopup.module.css
│   │   │   ├── FirstLogin.jsx                # Cambio obligatorio de contraseña
│   │   │   ├── FirstLogin.module.css
│   │   │   ├── AspiranteDashboard.jsx        # Panel principal aspirante
│   │   │   ├── AspiranteDashboard.module.css
│   │   │   ├── FormPreinscripcion.jsx        # Formulario 4 pasos
│   │   │   └── FormPreinscripcion.module.css
│   │   └── Login.jsx (actualizado)           # Soporte query params
│   ├── services/
│   │   └── aspiranteService.js               # Funciones API aspirantes
│   ├── hooks/
│   │   └── useAspiranteRegistro.js           # Hook para gestión de registro
│   └── App.jsx (actualizado)                 # Rutas públicas y protegidas
```

---

## 🚀 FLUJO PANTALLA POR PANTALLA

### 1️⃣ PASO 1: Registro de Correo (`/aspirante/registro`)

**Componente:** `RegistroCorreo.jsx`

**Funcionalidad:**
- Input único: correo electrónico con validación regex
- Botón "Solicitar clave temporal"
- Llama: `POST /api/aspirantes/solicitar-clave { correo }`
- Respuesta 200: `{ claveTemporal, aspiranteId }`
- Abre popup `ClaveTemporalPopup` con la clave

**Validaciones:**
```javascript
// Validación email
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**API:**
```javascript
// services/aspiranteService.js
POST /api/aspirantes/solicitar-clave
Body: { correo: "aspirante@ejemplo.com" }
Response: { 
  claveTemporal: "A1B2C3", 
  aspiranteId: 123 
}
```

---

### 2️⃣ PASO 2: Popup Clave Temporal

**Componente:** `ClaveTemporalPopup.jsx`

**Funcionalidad:**
- Muestra clave temporal en formato destacado
- Botón "Copiar" usando `navigator.clipboard.writeText()`
- Botón "Ir a iniciar sesión" → redirige a `/login?esAspirante=true&correo=xxx`
- Cierre de modal → también redirige a login

**Características:**
- Icono de éxito con animación
- Copiar al portapapeles con feedback visual
- Fallback para navegadores sin soporte de clipboard API

---

### 3️⃣ PASO 3: Login con Query Params (`/login?esAspirante=true&correo=xxx`)

**Componente:** `Login.jsx` (actualizado)

**Funcionalidad:**
- Detecta `esAspirante=true` en URL
- Pre-llena input correo (readonly si viene de registro)
- Muestra mensaje: "📧 **Usa la clave temporal que recibiste**"
- Submit: `POST /api/auth/login { correo, password: claveTemporal }`
- Si `response.cambiarPass === true` → redirige a `/first-login?rol=ASPIRANTE&correo=xxx`

**Código clave:**
```javascript
const [searchParams] = useSearchParams();
const esAspirante = searchParams.get('esAspirante') === 'true';
const correoParam = searchParams.get('correo') || '';

if (response.cambiarPass) {
  const rol = response.usuario?.rol || 'ASPIRANTE';
  navigate(`/first-login?rol=${rol}&correo=${encodeURIComponent(usuario)}`);
}
```

---

### 4️⃣ PASO 4: Primer Login - Cambio de Contraseña (`/first-login`)

**Componente:** `FirstLogin.jsx`

**Funcionalidad:**
- Componente **genérico** para todos los roles (ASPIRANTE, PROFESOR, ACUDIENTE, ADMIN)
- Lee `rol` y `correo` de query params
- 4 campos:
  - Correo (readonly)
  - Clave temporal
  - Nueva contraseña
  - Confirmar contraseña
- Validación con Zod:
  - Mínimo 8 caracteres
  - 1 mayúscula, 1 minúscula, 1 número

**API:**
```javascript
POST /api/auth/first-login
Body: {
  correo: "aspirante@ejemplo.com",
  claveTemporal: "A1B2C3",
  nuevaPassword: "MiNuevaPass123"
}
Response: {
  token: "eyJhbGc...",
  usuario: { id, nombre, rol, ... }
}
```

**Redirección:**
```javascript
const rutas = {
  ASPIRANTE: '/aspirante',
  PROFESOR: '/profesor',
  ACUDIENTE: '/acudiente',
  ADMIN: '/admin',
};
navigate(rutas[rol] || '/dashboard');
```

---

### 5️⃣ PASO 5: Dashboard Aspirante (`/aspirante`)

**Componente:** `AspiranteDashboard.jsx`

**Funcionalidad:**
- **Card Bienvenida:** nombre del usuario con emoji 👋
- **Card Estado Pre-inscripción:**
  - Si `estado === null` → "Incompleto" → botón "Completar pre-inscripción"
  - Si `estado === "Sin revisar"` → badge amarillo → botón "Ver formulario"
  - Si `estado === "Espera entrevista"` → badge azul → muestra fecha/hora entrevista
  - Si `estado === "Aprobado"` → badge verde → mensaje felicitaciones
- **Card Tu Información:** nombre y correo
- **Card Próximos Pasos:** lista numerada con progreso visual

**APIs:**
```javascript
// Obtener datos aspirante autenticado
GET /api/aspirantes/me
Response: { id, nombre, correo, estado, ... }

// Obtener estado pre-inscripción
GET /api/aspirantes/{id}/estado
Response: { 
  estado: "Sin revisar" | "Espera entrevista" | "Aprobado",
  fechaEntrevista?: "2024-12-15T10:00:00"
}
```

**Estados visuales:**
```css
.estadoIncompleto { background: #fed7d7; color: #c53030; }
.estadoSinRevisar { background: #feebc8; color: #c05621; }
.estadoEspera { background: #bee3f8; color: #2c5282; }
.estadoAprobado { background: #c6f6d5; color: #22543d; }
```

---

### 6️⃣ PASO 6: Formulario Pre-inscripción (Modal 4 Pasos)

**Componente:** `FormPreinscripcion.jsx`

**Estructura:** Formulario multi-paso con barra de progreso

#### **PASO 1: Datos del Acudiente**
```javascript
// Esquema Zod
esquemaPaso1 = z.object({
  nombreAcudiente: z.string().min(2).max(50),
  apellidoAcudiente: z.string().min(2).max(50),
  telefonoAcudiente: z.string().regex(/^3\d{9}$/), // Celular colombiano
  correoAcudiente: z.string().email(),
});
```

Campos:
- Nombre del Acudiente *
- Apellido del Acudiente *
- Teléfono (10 dígitos, inicia con 3) *
- Correo Electrónico *

---

#### **PASO 2: Datos del Estudiante**
```javascript
// Esquema Zod
esquemaPaso2 = z.object({
  nombreEstudiante: z.string().min(2).max(50),
  apellidoEstudiante: z.string().min(2).max(50),
  gradoAspirado: z.enum(['Párvulos', 'Caminadores', 'Pre-jardín']),
  fechaNacimiento: z.string().refine((fecha) => {
    const hoy = new Date();
    const edadMinima = new Date(hoy.getFullYear() - 3, ...);
    return new Date(fecha) <= edadMinima;
  }),
  registroCivil: z.string().min(5).max(20),
});
```

Campos:
- Nombre del Estudiante *
- Apellido del Estudiante *
- Grado al que Aspira * (select: Párvulos / Caminadores / Pre-jardín)
- Fecha de Nacimiento * (debe tener mínimo 3 años)
- Número de Registro Civil *

---

#### **PASO 3: Información Médica**
```javascript
// Esquema Zod
esquemaPaso3 = z.object({
  alergias: z.string().max(500).optional(),
  condicionesMedicas: z.string().max(500).optional(),
  medicamentos: z.string().max(500).optional(),
});
```

Campos opcionales (textarea):
- Alergias
- Condiciones Médicas Relevantes
- Medicamentos que Toma Regularmente

---

#### **PASO 4: Autorizaciones**
```javascript
// Esquema Zod
esquemaPaso4 = z.object({
  autorizacionDatos: z.boolean().refine((val) => val === true),
  autorizacionImagenes: z.boolean().refine((val) => val === true),
  autorizacionSalidas: z.boolean().refine((val) => val === true),
});
```

Checkboxes obligatorios:
1. **Tratamiento de Datos Personales** (Ley 1581 de 2012)
2. **Uso de Imágenes** (fotos/videos en actividades y redes)
3. **Salidas Pedagógicas** (autorización para excursiones)

---

#### **SUBMIT FINAL**

**API:**
```javascript
POST /api/aspirantes/{aspiranteId}/formulario
Body: {
  acudiente: {
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "3001234567",
    correo: "juan@ejemplo.com"
  },
  estudiante: {
    nombre: "María",
    apellido: "Pérez",
    gradoAspirado: "Párvulos",
    fechaNacimiento: "2020-05-15",
    registroCivil: "123456789"
  },
  medico: {
    alergias: "Ninguna",
    condicionesMedicas: "Ninguna",
    medicamentos: "Ninguno"
  },
  autorizaciones: {
    datos: true,
    imagenes: true,
    salidas: true
  }
}

Response: {
  estado: "Sin revisar"
}
```

**Flujo post-submit:**
1. Toast de éxito: "¡Formulario enviado exitosamente!"
2. Cierra modal
3. Dashboard actualiza estado a "Sin revisar"
4. Muestra badge amarillo con texto informativo

---

## 🔒 SEGURIDAD Y VALIDACIONES

### Frontend (React Hook Form + Zod)
```javascript
// Validación email
z.string().email()

// Validación teléfono Colombia
z.string().regex(/^3\d{9}$/)

// Validación edad mínima (3 años)
z.string().refine((fecha) => {
  const fechaNac = new Date(fecha);
  const hoy = new Date();
  const edadMinima = new Date(hoy.getFullYear() - 3, hoy.getMonth(), hoy.getDate());
  return fechaNac <= edadMinima;
})

// Validación contraseña
const validarPassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};
```

### Backend (Spring Boot)
```java
// DTOs con anotaciones de validación
@NotBlank
@Email
@DecimalMin("3")
@Pattern(regexp = "^3\\d{9}$")
```

---

## 🎨 ESTILOS Y UX

### Colores principales
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success:** `#48bb78` (verde aprobado)
- **Warning:** `#ed8936` (naranja sin revisar)
- **Info:** `#4299e1` (azul espera entrevista)
- **Error:** `#fc8181` (rojo errores)

### Animaciones
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}
```

### Responsive
- **Desktop:** Grid de 2-3 columnas, modales 800px max-width
- **Tablet (< 768px):** Grid de 1 columna, padding reducido
- **Mobile (< 480px):** Modales full-screen, botones apilados

---

## 🔗 RUTAS CONFIGURADAS

### Rutas Públicas
```jsx
/aspirante/registro         → RegistroCorreo
/login                      → Login (con soporte query params)
/first-login                → FirstLogin (genérico todos los roles)
```

### Rutas Protegidas (rol: ASPIRANTE)
```jsx
/aspirante                  → AspiranteDashboard
```

### Configuración en App.jsx
```jsx
{/* Públicas */}
<Route path="/aspirante/registro" element={<RegistroCorreo />} />

{/* Protegidas */}
<Route
  path="/aspirante"
  element={
    <ProtectedRoute allowedRoles={['ASPIRANTE']}>
      <AspiranteDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📊 ESTADOS Y FLUJO DE DATOS

### Hook `useAspiranteRegistro`
```javascript
const {
  registroStatus,    // 'idle' | 'sending' | 'ok' | 'error'
  claveTemporal,     // string | null
  aspiranteId,       // number | null
  error,             // string | null
  solicitarClave,    // function
  resetear,          // function
} = useAspiranteRegistro();
```

### Estado Dashboard
```javascript
const [aspirante, setAspirante] = useState(null);
const [estado, setEstado] = useState(null);
const [mostrarFormulario, setMostrarFormulario] = useState(false);
```

### Estado Formulario
```javascript
const [paso, setPaso] = useState(1); // 1-4
const [enviando, setEnviando] = useState(false);
const [datosFormulario, setDatosFormulario] = useState({});
```

---

## 🧪 TESTING

### Flujo completo de prueba:

1. **Navegar a** `/aspirante/registro`
2. **Ingresar correo:** `aspirante.test@academia.ud`
3. **Click** "Solicitar clave temporal"
4. **Copiar clave** del popup (ej: `A1B2`)
5. **Click** "Ir a iniciar sesión"
6. **Verificar:** URL contiene `?esAspirante=true&correo=...`
7. **Verificar:** Input correo está readonly y pre-llenado
8. **Pegar clave temporal** en campo contraseña
9. **Click** "Iniciar sesión"
10. **Redirige a** `/first-login?rol=ASPIRANTE&correo=...`
11. **Crear nueva contraseña:** `Aspirante123`
12. **Click** "Cambiar contraseña"
13. **Redirige a** `/aspirante`
14. **Verificar:** Dashboard muestra bienvenida y estado "Incompleto"
15. **Click** "Completar pre-inscripción"
16. **Llenar Paso 1:** Datos acudiente
17. **Click** "Siguiente"
18. **Llenar Paso 2:** Datos estudiante
19. **Click** "Siguiente"
20. **Llenar Paso 3:** (opcional) Info médica
21. **Click** "Siguiente"
22. **Marcar checkboxes** autorizaciones
23. **Click** "Enviar formulario"
24. **Verificar:** Toast éxito
25. **Verificar:** Dashboard muestra estado "Sin revisar"

---

## 🚨 TROUBLESHOOTING

### Error: "No se puede resolver import"
**Solución:** Verificar que todos los archivos estén en `src/pages/Aspirante/`

### Error: "Cannot read property 'estado'"
**Solución:** Verificar que backend responde correctamente en `/api/aspirantes/me`

### Error: "Clave temporal inválida"
**Solución:** Verificar que backend genera y almacena clave en tabla `TokenUsuario`

### Warning: "React Hook useEffect missing dependency"
**Solución:** Añadir dependencias faltantes o suprimir warning con comentario

---

## 📦 DEPENDENCIAS

### Instaladas
```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "react-hot-toast": "^2.x",
  "react-router-dom": "^6.x"
}
```

### Comandos
```bash
npm install react-hook-form @hookform/resolvers zod react-hot-toast
```

---

## ✅ CHECKLIST FINAL

- [x] RegistroCorreo.jsx + CSS
- [x] ClaveTemporalPopup.jsx + CSS
- [x] FirstLogin.jsx + CSS (genérico)
- [x] AspiranteDashboard.jsx + CSS
- [x] FormPreinscripcion.jsx + CSS (4 pasos)
- [x] aspiranteService.js (APIs)
- [x] useAspiranteRegistro.js (hook)
- [x] App.jsx (rutas)
- [x] Login.jsx (query params)
- [x] Login.module.css (estilos info aspirante)
- [x] README_INICIO_ASPIRANTE.md

---

## 🎉 RESULTADO

**Frontend listo para:**
```bash
npm run dev
```

**Aspirante puede:**
1. ✅ Registrar correo → recibir clave
2. ✅ Login con clave temporal
3. ✅ Cambiar contraseña obligatorio
4. ✅ Acceder a dashboard personalizado
5. ✅ Completar formulario 4 pasos con validaciones
6. ✅ Ver estado actualizado en tiempo real

**Todo con CSS modules, sin Tailwind, sin libs UI externas.**

---

## 📞 CONTACTO

Para dudas sobre implementación backend o ajustes:
- Revisar endpoints en `AspiranteController.java`
- Verificar entidades: `Aspirante`, `TokenUsuario`
- Validar DTOs: `AspiranteRequest`, `FormularioPreinscripcionRequest`

**¡Flujo completo implementado! 🚀**
