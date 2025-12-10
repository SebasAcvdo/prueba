# Veritas - Sistema de Gestión Educativa (FASE 2)

Frontend React + Vite para el sistema de gestión educativa Veritas.

## 🚀 Tecnologías

- **Vite** 7.2.4 - Build tool y dev server ultra rápido
- **React** 19.2.0 - Biblioteca UI
- **React Router** 6.26.0 - Enrutamiento SPA
- **Axios** 1.7.7 - Cliente HTTP
- **React Hook Form** 7.53.0 + **Zod** 3.23.8 - Validación de formularios
- **React Hot Toast** 2.4.1 - Notificaciones
- **React Day Picker** 9.1.3 - Selector de fechas
- **React Icons** 5.3.0 - Iconos (Tabler)
- **CSS Modules** - Estilos modulares sin Tailwind

## 📁 Estructura del Proyecto

```
frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── LogoVeritas.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── TopBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── BadgeEstado.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PdfDownload.jsx
│   │   │   ├── CalendarInput.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── forms/
│   │       ├── Input.jsx
│   │       └── SelectMulti.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAxiosPrivate.js
│   │   ├── useUsuarios.js
│   │   ├── useAspirantes.js
│   │   ├── useGrupos.js
│   │   ├── useCitaciones.js
│   │   └── useCalificaciones.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── FirstLogin.jsx
│   │   ├── Dashboard.jsx
│   │   └── (otras páginas por implementar)
│   ├── services/
│   │   ├── auth.js
│   │   ├── usuario.js
│   │   ├── aspirante.js
│   │   ├── grupo.js
│   │   ├── citacion.js
│   │   ├── calificacion.js
│   │   └── reporte.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README_FASE2.md
```

## 🎨 Sistema de Diseño

### Colores (Variables CSS)

```css
--primary: #0F1A30
--primary-dark: #0a1220
--accent: #FA761B
--success: #28a745
--error: #dc2626
--text-primary: #1f2937
--text-secondary: #6b7280
--bg-primary: #f9fafb
--bg-secondary: #f3f4f6
--border: #e5e7eb
```

### Iconos

Se utilizan únicamente los iconos de **Tabler** desde `react-icons`:

```jsx
import { IconHome, IconUsers, IconPlus } from '@tabler/icons-react';
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_URL=http://localhost:8090
```

### Proxy Vite

El archivo `vite.config.js` ya está configurado para hacer proxy de las peticiones `/api` al backend en `http://localhost:8090`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8090',
      changeOrigin: true,
    },
  },
}
```

## 📦 Instalación

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone <url-repositorio>

# Navegar al directorio del frontend
cd "C:\Users\Sebas\Downloads\fis prueba\frontend"

# Instalar dependencias
npm install
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

### Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa del Build

```bash
npm run preview
```

## 🔐 Autenticación

El sistema utiliza **JWT tokens** para la autenticación:

1. **Login** → POST `/api/auth/login`
   - Credenciales: `usuario` y `password`
   - Respuesta: `{ token, usuario, debeResetearPassword }`

2. **Reset Password** (primer login) → PUT `/api/auth/reset-password`
   - Parámetros: `usuario` y `nuevaPassword`

3. **Token Storage**
   - El token se guarda en `localStorage`
   - Se envía automáticamente en cada request mediante interceptors

4. **Interceptors Axios**
   - Request: Añade `Authorization: Bearer <token>`
   - Response: Detecta 401 y ejecuta logout automático

## 🧭 Rutas y Roles

### Públicas
- `/login` - Pantalla de inicio de sesión
- `/first-login` - Cambio de contraseña obligatorio

### Protegidas
- `/dashboard` - Dashboard principal (todos los roles)

### Administrador
- `/admin/usuarios` - Gestión de usuarios
- `/admin/aspirantes` - Gestión de aspirantes
- `/admin/grupos` - Gestión de grupos

### Profesor
- `/profesor/grupos` - Mis grupos asignados
- `/profesor/citaciones` - Gestión de citaciones
- `/profesor/calificaciones` - Registro de calificaciones

### Acudiente
- `/acudiente/citaciones` - Ver citaciones
- `/acudiente/calificaciones` - Ver calificaciones de estudiantes
- `/acudiente/boletines` - Descargar boletines

## 🛠️ Componentes Principales

### Layout
```jsx
<Layout title="Mi Página">
  <ContenidoDeLaPagina />
</Layout>
```

Incluye automáticamente `TopBar` y `Sidebar`.

### Table
```jsx
<Table
  columns={[
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Estado', render: (row) => <BadgeEstado estado={row.estado} /> }
  ]}
  data={usuarios}
  emptyMessage="No hay usuarios"
/>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del Modal"
  size="medium"
  footer={<Button onClick={handleSave}>Guardar</Button>}
>
  Contenido del modal
</Modal>
```

### Button
```jsx
<Button
  variant="primary" // primary | accent | secondary | danger
  size="medium" // small | medium | large
  icon={IconPlus}
  loading={loading}
  onClick={handleClick}
>
  Texto del botón
</Button>
```

### Input
```jsx
<Input
  label="Nombre"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  error={errors.nombre}
  required
/>
```

### SelectMulti
```jsx
<SelectMulti
  label="Logros"
  options={logros}
  value={selectedLogros}
  onChange={setSelectedLogros}
  getOptionLabel={(opt) => opt.nombre}
  getOptionValue={(opt) => opt.logroId}
/>
```

### PdfDownload
```jsx
<PdfDownload
  fileName="boletin.pdf"
  fetchPdf={() => reporteService.descargarBoletin(estudianteId, periodo, token)}
  buttonText="Descargar Boletín"
  variant="accent"
/>
```

## 🪝 Custom Hooks

### useUsuarios
```jsx
const { usuarios, loading, fetchUsuarios, crearUsuario, actualizarUsuario, cambiarEstado } = useUsuarios();
```

### useAspirantes
```jsx
const { aspirantes, loading, fetchAspirantes, crearAspirante, cambiarEstado, agendarEntrevista } = useAspirantes();
```

### useGrupos
```jsx
const { grupos, loading, fetchGrupos, crearGrupo, confirmarGrupo, descargarListado } = useGrupos();
```

### useCitaciones
```jsx
const { citaciones, loading, fetchCitaciones, crearCitacion } = useCitaciones();
```

### useCalificaciones
```jsx
const { calificaciones, loading, fetchCalificaciones, crearCalificacion, actualizarCalificacion } = useCalificaciones();
```

## 🔌 Servicios API

Todos los servicios están en `src/services/` y utilizan Axios configurado con la `baseURL` de `.env`:

```javascript
// Ejemplo de uso
import { usuarioService } from '../services/usuario';

const usuarios = await usuarioService.listar(0, 20, token);
const nuevoUsuario = await usuarioService.crear(data, token);
```

## 📱 Responsive Design

El diseño es responsive con breakpoints:
- Desktop: > 768px (sidebar fijo)
- Mobile: ≤ 768px (sidebar overlay)

## 🎯 Estado de Implementación

### ✅ Completado

- ✅ Configuración de Vite con proxy
- ✅ Sistema de diseño (CSS variables, reset, utilities)
- ✅ Logo Veritas (SVG component)
- ✅ AuthContext con login/logout/resetPassword
- ✅ Servicios API completos (auth, usuario, aspirante, grupo, citación, calificación, reporte)
- ✅ useAxiosPrivate hook con interceptors
- ✅ Hooks personalizados (useUsuarios, useAspirantes, useGrupos, useCitaciones, useCalificaciones)
- ✅ Componentes comunes (Button, Spinner, BadgeEstado, Table, Modal, TopBar, Sidebar, Layout, PdfDownload, CalendarInput, NotFound, ProtectedRoute)
- ✅ Componentes de formularios (Input, SelectMulti)
- ✅ Páginas de autenticación (Login, FirstLogin)
- ✅ Dashboard principal
- ✅ Router con ProtectedRoute
- ✅ Instalación de dependencias

### 🔄 Pendiente

- ⏳ Páginas de administración (Usuarios, Aspirantes, Grupos)
- ⏳ Páginas de profesor (Grupos, Citaciones, Calificaciones)
- ⏳ Páginas de acudiente (Citaciones, Calificaciones, Boletines)
- ⏳ Formularios específicos (FormUsuario, FormGrupo, FormCitacion, FormCalificacion)
- ⏳ Pruebas end-to-end

## 🐛 Resolución de Problemas

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en `localhost:8090`
2. Verifica la variable de entorno en `.env`
3. Revisa la consola del navegador para ver errores de CORS

### Error 401 Unauthorized

- Verifica que el token no haya expirado
- El sistema hace logout automático en caso de 401

### Estilos no se aplican

- Verifica que `index.css` esté importado en `main.jsx`
- Los CSS Modules deben tener extensión `.module.css`

## 📚 Recursos

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Tabler Icons](https://tabler-icons.io)

## 👥 Roles del Sistema

- **ADMINISTRADOR**: Gestión completa del sistema
- **PROFESOR**: Gestión de grupos, citaciones y calificaciones
- **ACUDIENTE**: Consulta de información de estudiantes

---

**Nota**: Este proyecto fue desarrollado como parte del sistema de gestión educativa Veritas. Para el backend (FASE 1), consulta el README principal del proyecto.
