# Script de inicio rápido para el proyecto Academia UD
# PowerShell Script

# Configurar JAVA_HOME si no está configurado
if (-not $env:JAVA_HOME) {
    Write-Host "Buscando instalación de Java..." -ForegroundColor Yellow
    $javaLocations = @(
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Java\jdk-17",
        "C:\Program Files\Eclipse Adoptium\jdk-21",
        "C:\Program Files\Eclipse Adoptium\jdk-17",
        "C:\Program Files\Amazon Corretto\jdk21",
        "C:\Program Files\Amazon Corretto\jdk17"
    )
    
    foreach ($loc in $javaLocations) {
        if (Test-Path $loc) {
            $env:JAVA_HOME = $loc
            Write-Host "✓ JAVA_HOME configurado: $loc" -ForegroundColor Green
            break
        }
    }
    
    if (-not $env:JAVA_HOME) {
        # Buscar cualquier instalación de Java
        $foundJava = Get-ChildItem "C:\Program Files\Java" -Directory -ErrorAction SilentlyContinue | 
                     Where-Object { $_.Name -like "jdk*" } | 
                     Select-Object -First 1
        
        if ($foundJava) {
            $env:JAVA_HOME = $foundJava.FullName
            Write-Host "✓ JAVA_HOME configurado: $($foundJava.FullName)" -ForegroundColor Green
        }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ACADEMIA UD - FASE 1 BACKEND" -ForegroundColor Cyan
Write-Host "  Spring Boot 3.2.5 + Java 17" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java encontrado: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java no encontrado. Instale Java 17 o superior." -ForegroundColor Red
    exit 1
}

# Verificar Maven
Write-Host "Verificando Maven..." -ForegroundColor Yellow
$useMvnWrapper = $false
try {
    $mavenVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Host "✓ Maven encontrado: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "✓ Usando Maven Wrapper (mvnw.cmd)" -ForegroundColor Yellow
    $useMvnWrapper = $true
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OPCIONES DE EJECUCIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ejecutar en modo DESARROLLO (H2 en memoria)" -ForegroundColor White
Write-Host "2. Ejecutar en modo PRODUCCIÓN (MySQL)" -ForegroundColor White
Write-Host "3. Compilar proyecto (mvn clean install)" -ForegroundColor White
Write-Host "4. Ver información del proyecto" -ForegroundColor White
Write-Host "5. Salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Seleccione una opción (1-5)"

# Determinar el comando Maven a usar
$mvnCmd = if ($useMvnWrapper) { ".\mvnw.cmd" } else { "mvn" }

switch ($opcion) {
    1 {
        Write-Host ""
        Write-Host "Iniciando en modo DESARROLLO..." -ForegroundColor Green
        Write-Host "Base de datos: H2 (en memoria)" -ForegroundColor Yellow
        Write-Host "Perfil: dev" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Swagger UI estará disponible en: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
        Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Credenciales de prueba:" -ForegroundColor Magenta
        Write-Host "  Admin: admin@academia.ud / Admin123*" -ForegroundColor White
        Write-Host "  Profesor: maria.gonzalez@academia.ud / Prof123*" -ForegroundColor White
        Write-Host ""
        & $mvnCmd spring-boot:run
    }
    2 {
        Write-Host ""
        Write-Host "Iniciando en modo PRODUCCIÓN..." -ForegroundColor Green
        Write-Host "Base de datos: MySQL" -ForegroundColor Yellow
        Write-Host "Perfil: prod" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "IMPORTANTE: Asegúrese de haber ejecutado el script schema.sql en MySQL" -ForegroundColor Red
        Write-Host ""
        $continuar = Read-Host "¿Desea continuar? (S/N)"
        if ($continuar -eq "S" -or $continuar -eq "s") {
            Write-Host ""
            Write-Host "Swagger UI estará disponible en: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
            Write-Host ""
            & $mvnCmd spring-boot:run "-Dspring.profiles.active=prod"
        }
    }
    3 {
        Write-Host ""
        Write-Host "Compilando proyecto..." -ForegroundColor Green
        Write-Host ""
        & $mvnCmd clean install
        Write-Host ""
        Write-Host "✓ Compilación completada" -ForegroundColor Green
        Write-Host ""
        Read-Host "Presione Enter para salir"
    }
    4 {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  INFORMACIÓN DEL PROYECTO" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Nombre: Academia UD - FASE 1" -ForegroundColor White
        Write-Host "Versión: 1.0.0" -ForegroundColor White
        Write-Host "Framework: Spring Boot 3.2.5" -ForegroundColor White
        Write-Host "Java: 17" -ForegroundColor White
        Write-Host "Base de datos: MySQL 8 / H2" -ForegroundColor White
        Write-Host ""
        Write-Host "Casos de Uso implementados: 18" -ForegroundColor Green
        Write-Host "Endpoints REST: 18+" -ForegroundColor Green
        Write-Host "Entidades JPA: 10" -ForegroundColor Green
        Write-Host "Controladores: 7" -ForegroundColor Green
        Write-Host "Servicios: 9" -ForegroundColor Green
        Write-Host ""
        Write-Host "URLs importantes:" -ForegroundColor Yellow
        Write-Host "  - API Base: http://localhost:8080" -ForegroundColor White
        Write-Host "  - Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor White
        Write-Host "  - H2 Console (dev): http://localhost:8080/h2-console" -ForegroundColor White
        Write-Host ""
        Write-Host "Documentación:" -ForegroundColor Yellow
        Write-Host "  - README_FASE1.md (instrucciones completas)" -ForegroundColor White
        Write-Host "  - RESUMEN_COMPLETO.md (resumen técnico)" -ForegroundColor White
        Write-Host "  - postman/FASE1.postman_collection.json (pruebas)" -ForegroundColor White
        Write-Host ""
        Read-Host "Presione Enter para volver al menú"
        & $PSCommandPath
    }
    5 {
        Write-Host ""
        Write-Host "¡Hasta pronto!" -ForegroundColor Cyan
        Write-Host ""
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "Opción inválida" -ForegroundColor Red
        Write-Host ""
        Read-Host "Presione Enter para salir"
    }
}
