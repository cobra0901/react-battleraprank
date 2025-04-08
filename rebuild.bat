@echo off
echo Cleaning Next.js cache...
IF EXIST ".next" rmdir /s /q .next
IF EXIST "node_modules\.cache" rmdir /s /q node_modules\.cache

echo Building application...
npm run build

echo Starting development server...
npm run dev
