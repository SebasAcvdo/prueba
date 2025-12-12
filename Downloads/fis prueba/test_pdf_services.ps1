# Script de prueba para servicios PDF - FASE 3
# Asegúrate de que el backend esté ejecutándose en http://localhost:8090

Write-Host "=== PRUEBA DE SERVICIOS PDF - FASE 3 ===" -ForegroundColor Cyan
Write-Host ""

# Configuración
$baseUrl = "http://localhost:8090/api"
$outputDir = ".\pdf_test_outputs"

# Crear directorio de salida si no existe
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "✓ Directorio de salida creado: $outputDir" -ForegroundColor Green
}

# Paso 1: Login como ADMIN
Write-Host "1. Autenticando como ADMIN..." -ForegroundColor Yellow
$loginBody = @{
    correo = "admin@academia.ud"
    password = "Admin123*"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Login exitoso - Token obtenido" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.nombre)" -ForegroundColor Gray
    Write-Host "   Rol: $($loginResponse.rol)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Headers con JWT
$headers = @{
    "Authorization" = "Bearer $token"
}

# Paso 2: Obtener grupos disponibles
Write-Host "2. Obteniendo lista de grupos..." -ForegroundColor Yellow
try {
    $grupos = Invoke-RestMethod -Uri "$baseUrl/grupos" -Method Get -Headers $headers
    Write-Host "   ✓ Grupos encontrados: $($grupos.Count)" -ForegroundColor Green
    
    if ($grupos.Count -gt 0) {
        $grupos | ForEach-Object {
            Write-Host "      - ID: $($_.id) | Nombre: $($_.nombre) | Grado: $($_.grado)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ✗ Error obteniendo grupos: $($_.Exception.Message)" -ForegroundColor Red
    $grupos = @()
}

Write-Host ""

# Paso 3: Generar PDF de Listado de Grupo
if ($grupos.Count -gt 0) {
    $grupoId = $grupos[0].id
    Write-Host "3. Generando PDF de Listado de Grupo (ID: $grupoId)..." -ForegroundColor Yellow
    
    try {
        $pdfPath = "$outputDir\listado_grupo_$grupoId.pdf"
        Invoke-RestMethod -Uri "$baseUrl/reportes/grupo/$grupoId/listado" -Method Get -Headers $headers -OutFile $pdfPath
        
        if (Test-Path $pdfPath) {
            $fileSize = (Get-Item $pdfPath).Length
            Write-Host "   ✓ PDF generado exitosamente" -ForegroundColor Green
            Write-Host "   Archivo: $pdfPath" -ForegroundColor Gray
            Write-Host "   Tamaño: $fileSize bytes" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ Error generando PDF de grupo: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "3. Saltando PDF de grupo (no hay grupos disponibles)" -ForegroundColor Yellow
}

Write-Host ""

# Paso 4: Obtener estudiantes disponibles
Write-Host "4. Obteniendo lista de estudiantes..." -ForegroundColor Yellow
try {
    # Nota: Asumiendo que hay un endpoint para listar estudiantes
    # Si no existe, usar datos de prueba conocidos
    $estudianteId = 1
    Write-Host "   ℹ Usando estudiante ID: $estudianteId (dato de prueba)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error obteniendo estudiantes" -ForegroundColor Red
    $estudianteId = $null
}

Write-Host ""

# Paso 5: Generar PDF de Boletín - Periodo 1
if ($estudianteId) {
    Write-Host "5. Generando PDF de Boletín (Estudiante ID: $estudianteId, Periodo: 1)..." -ForegroundColor Yellow
    
    try {
        $pdfPath = "$outputDir\boletin_estudiante_${estudianteId}_periodo1.pdf"
        Invoke-RestMethod -Uri "$baseUrl/reportes/estudiante/$estudianteId/boletin?periodo=1" -Method Get -Headers $headers -OutFile $pdfPath
        
        if (Test-Path $pdfPath) {
            $fileSize = (Get-Item $pdfPath).Length
            Write-Host "   ✓ PDF generado exitosamente" -ForegroundColor Green
            Write-Host "   Archivo: $pdfPath" -ForegroundColor Gray
            Write-Host "   Tamaño: $fileSize bytes" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ Error generando boletín: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "5. Saltando PDF de boletín (no hay estudiantes disponibles)" -ForegroundColor Yellow
}

Write-Host ""

# Paso 6: Generar PDF de Boletín - Todos los periodos
if ($estudianteId) {
    Write-Host "6. Generando PDF de Boletín Completo (Todos los periodos)..." -ForegroundColor Yellow
    
    try {
        $pdfPath = "$outputDir\boletin_estudiante_${estudianteId}_completo.pdf"
        Invoke-RestMethod -Uri "$baseUrl/reportes/estudiante/$estudianteId/boletin" -Method Get -Headers $headers -OutFile $pdfPath
        
        if (Test-Path $pdfPath) {
            $fileSize = (Get-Item $pdfPath).Length
            Write-Host "   ✓ PDF generado exitosamente" -ForegroundColor Green
            Write-Host "   Archivo: $pdfPath" -ForegroundColor Gray
            Write-Host "   Tamaño: $fileSize bytes" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ Error generando boletín completo: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "6. Saltando PDF de boletín completo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
Write-Host ""

# Abrir directorio de salida si hay archivos
if ((Get-ChildItem $outputDir -Filter "*.pdf").Count -gt 0) {
    Write-Host "📁 Abriendo directorio con los PDFs generados..." -ForegroundColor Green
    Start-Process $outputDir
    Write-Host ""
    Write-Host "Revisa los PDFs generados para verificar:" -ForegroundColor Yellow
    Write-Host "  ✓ Header con color #E6F2FF" -ForegroundColor Gray
    Write-Host "  ✓ Logo Veritas" -ForegroundColor Gray
    Write-Host "  ✓ Tablas con estilos profesionales" -ForegroundColor Gray
    Write-Host "  ✓ Fuente Helvetica" -ForegroundColor Gray
    Write-Host "  ✓ Footer con fecha" -ForegroundColor Gray
} else {
    Write-Host "⚠ No se generaron PDFs. Verifica que el backend tenga datos de prueba." -ForegroundColor Yellow
}

Write-Host ""
