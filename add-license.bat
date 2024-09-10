@echo off
setlocal

REM Define the license file name and location
set LICENSE_FILE=apache-license.txt

REM Define the target directory where the license will be added
set TARGET_DIR=C:\Users\Mrx\Desktop\Babylon\Anrionx

REM Copy the license file to the target directory
copy "%LICENSE_FILE%" "%TARGET_DIR%\LICENSE"

echo License file added to %TARGET_DIR%
