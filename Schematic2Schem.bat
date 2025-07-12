@echo off
SETLOCAL

REM Set the path to the Node.js version folder
set NODE_PATH=%~dp0node-v18.16.0-win-x64

REM Add Node.js to the system PATH variable
set PATH=%NODE_PATH%;%PATH%

REM Check if node_modules folder exists
IF NOT EXIST node_modules (
    echo This is your first run and some dependencies need to be installed first.
    echo This setup will: 
	echo - run the command "npm install" to install the necessary dependencies to run the program. These dependencies are self-contained and will only affect the files in this directory.
	echo Press enter to accept and start the setup...
    pause >nul
	echo.
    CALL npm install
)

REM Run main.js using Node.js
node main.js