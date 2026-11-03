Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Compiling and launching MatSci Platform (Java)..." -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

if (!(Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

Write-Host "[1/2] Compiling Java source files..." -ForegroundColor Yellow
javac -d bin -encoding UTF-8 -sourcepath src src/com/matsci/Main.java

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Compilation failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[2/2] Starting server at http://localhost:8080 ..." -ForegroundColor Green
java -cp bin com.matsci.Main
