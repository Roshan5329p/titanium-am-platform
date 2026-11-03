@echo off
title MatSci Platform - Materials & Process Intelligence
echo ==================================================================
echo   Compiling and launching MatSci Platform (Java 26)...
echo ==================================================================

if not exist bin mkdir bin

echo [1/2] Compiling Java source files...
javac -d bin -encoding UTF-8 -sourcepath src src/com/matsci/Main.java

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [2/2] Starting server on http://localhost:8080 ...
echo [INFO] Serving Replicated Cinematic MatSci Command Dashboard at http://localhost:8080
java -cp bin com.matsci.Main

pause
