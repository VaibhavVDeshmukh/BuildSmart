@echo off
REM - Build the client and copy to server
REM - build the server - npm i/npx prisma db push/ npx prisma generate/npm run build
REM Record the start time of the entire script
set startTime=%time%

REM Section 1: S2M Account Server
echo Starting S2M ACCOUNT Server build at %time%
@echo off
REM Check if nvs is installed
where nvs >NUL 2>&1
IF %ERRORLEVEL% EQU 0 (
    call nvs use 18.17.0
) ELSE (
    echo nvs not found; using system Node.js version
)
call npm run build:exe