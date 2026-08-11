@echo off
cd /d "%~dp0"
echo Starting backend with dev profile (in-memory H2 database)...
echo Demo login: demo@example.com / password123
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
