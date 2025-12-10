# 🚀 GUÍA DE INICIO RÁPIDO - 5 MINUTOS

## Paso 1: Verificar Requisitos (30 segundos)

Abrir PowerShell y ejecutar:
```powershell
java -version    # Debe ser Java 17+
mvn -version     # Debe ser Maven 3.9+
```

Si no aparecen, instalar:
- Java 17: https://adoptium.net/
- Maven: https://maven.apache.org/download.cgi

---

## Paso 2: Iniciar el Proyecto (1 minuto)

### Opción A: Script Automático (Recomendado)
```powershell
cd "c:\Users\Sebas\Downloads\fis prueba"
.\INICIAR.ps1
# Seleccionar opción 1 (Modo Desarrollo)
```

### Opción B: Comando Manual
```powershell
cd "c:\Users\Sebas\Downloads\fis prueba"
mvn spring-boot:run
```

Esperar a ver el mensaje:
```
Started AcademiaUdApplication in X.XXX seconds
```

---

## Paso 3: Probar Swagger UI (30 segundos)

1. Abrir navegador en: **http://localhost:8090/swagger-ui.html**
2. Verás todos los endpoints organizados por módulos
3. Click en "Authorize" (candado en la esquina superior derecha)

---

## Paso 4: Hacer Login (1 minuto)

### En Swagger UI:

1. Expandir **"1. Autenticación"** → **"POST /api/auth/login"**
2. Click en **"Try it out"**
3. Pegar este JSON:
```json
{
  "correo": "admin@academia.ud",
  "password": "Admin123*"
}
```
4. Click en **"Execute"**
5. Copiar el valor de `"accessToken"` (sin comillas)
6. Click en el botón **"Authorize"** arriba
7. En el campo "Value" pegar: **Bearer [tu_token]** (reemplazar [tu_token] con el token copiado)
8. Click **"Authorize"** y luego **"Close"**

---

## Paso 5: Probar un Endpoint (30 segundos)

### Listar Usuarios:

1. Expandir **"2. Gestión de Usuarios"** → **"GET /api/usuarios/page"**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Verás la lista de usuarios en formato JSON

---

## 🎯 Pruebas Rápidas Adicionales

### Crear un Grupo (C.U 32):
1. **"3. Gestión de grupos y matrículas"** → **POST /api/grupos**
2. **Try it out**
3. Pegar:
```json
{
  "nombre": "Jardín A",
  "grado": "Jardín",
  "capacidad": 20,
  "profesorId": 2
}
```
4. **Execute** → Verás el grupo creado con ID

### Crear Calificación (C.U 9):
**Primero hacer login como profesor:**
```json
{
  "correo": "maria.gonzalez@academia.ud",
  "password": "Prof123*"
}
```

Luego:
1. **"7. Gestión de Calificaciones"** → **POST /api/calificaciones**
2. **Try it out**
3. Pegar:
```json
{
  "valor": 4.5,
  "periodo": 1,
  "logroId": 1,
  "estudianteId": 1
}
```
4. **Execute**

### Generar PDF de Listado (C.U 34):
1. **"3. Gestión de grupos"** → **GET /api/grupos/{id}/listado.pdf**
2. Cambiar `id` por `1`
3. **Try it out** → **Execute**
4. Click en **"Download file"** para descargar el PDF

### Generar Boletín PDF (C.U 8):
1. **"7. Gestión de Calificaciones"** → **GET /api/calificaciones/reporte/boletin**
2. **Try it out**
3. Parámetros:
   - `estudianteId`: 1
   - `periodo`: 1 (opcional)
4. **Execute** → **Download file**

---

## 🔍 Verificar Base de Datos H2

**URL:** http://localhost:8090/h2-console

**Configuración:**
- Driver Class: `org.h2.Driver`
- JDBC URL: `jdbc:h2:mem:academia_dev`
- User Name: `sa`
- Password: (dejar vacío)

Click **"Connect"** para ver las tablas.

---

## 📬 Probar con Postman (Alternativa a Swagger)

1. Abrir Postman
2. **File** → **Import**
3. Seleccionar: `postman/FASE1.postman_collection.json`
4. En la colección, ejecutar **"C.U 25 - Login Admin"**
5. El token se guarda automáticamente
6. Probar los demás endpoints

---

## 🎓 18 Casos de Uso Implementados

### ✅ Autenticación (2)
- C.U 25: Login
- C.U 26: First Login

### ✅ Usuarios (4)
- C.U 17: Crear usuario
- C.U 17.1: Actualizar usuario
- C.U 18: Listar usuarios
- C.U 20: Habilitar/Deshabilitar

### ✅ Grupos (3)
- C.U 32: Crear grupo
- C.U 33: Confirmar grupo
- C.U 34: Generar listado PDF

### ✅ Aspirantes (3)
- C.U 28: Crear aspirante
- C.U 30: Cambiar estado
- C.U 31: Agendar entrevista

### ✅ Citaciones (4)
- C.U 1: Crear citación
- C.U 2: Listar grupales
- C.U 4: Listar individuales
- C.U 5: Listar aspirantes

### ✅ Calificaciones (4)
- C.U 7: Consultar calificaciones
- C.U 8: Generar boletín PDF
- C.U 9: Crear calificación
- C.U 10: Modificar calificación

---

## 🆘 Solución de Problemas

### Error: Puerto 8080 ocupado
```powershell
# Cambiar puerto en application.properties
server.port=8081
```

### Error: Java no encontrado
```powershell
# Verificar JAVA_HOME
echo $env:JAVA_HOME

# Si no está configurado, agregar a variables de entorno
```

### Error de compilación
```powershell
mvn clean install -U
```

### Detener el servidor
Presionar **Ctrl + C** en la terminal donde está corriendo

---

## 📞 Credenciales Completas

| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Director | admin@academia.ud | Admin123* | ADMIN |
| María González | maria.gonzalez@academia.ud | Prof123* | PROFESOR |
| Carlos Rodríguez | carlos.rodriguez@academia.ud | Prof123* | PROFESOR |
| Ana Martínez | ana.martinez@correo.com | Acud123* | ACUDIENTE |
| Luis Pérez | luis.perez@correo.com | Acud123* | ACUDIENTE |

---

## ✅ Checklist de Verificación

- [ ] Java 17+ instalado
- [ ] Maven 3.9+ instalado
- [ ] Proyecto inicia sin errores
- [ ] Swagger UI accesible
- [ ] Login exitoso como admin
- [ ] Lista de usuarios visible
- [ ] PDF de grupo se descarga
- [ ] Boletín PDF se genera
- [ ] H2 Console accesible
- [ ] Postman collection importada

---

## 🎉 ¡Listo para Producción!

**Siguiente paso:** Configurar MySQL para producción (ver README_FASE1.md)

**Documentación completa:** README_FASE1.md  
**Resumen técnico:** RESUMEN_COMPLETO.md  
**Swagger UI:** http://localhost:8080/swagger-ui.html

---

**Tiempo total de setup: ~5 minutos** ⏱️
