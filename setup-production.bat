@echo off
echo ========================================
echo    Tax Invoice App - Production Setup
echo ========================================
echo.

echo Step 1: Installing required packages...
npm install --save-dev @types/nodemailer
npm install jspdf html2canvas
echo.

echo Step 2: Creating .env.local file...
if not exist .env.local (
    copy env.example .env.local
    echo Created .env.local file
    echo Please edit .env.local with your email credentials
) else (
    echo .env.local already exists
)
echo.

echo Step 3: Building the project...
npm run build
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env.local with your Gmail credentials
echo 2. Test locally: npm run dev
echo 3. Deploy to your hosting platform
echo.
echo See PRODUCTION_SETUP.md for detailed instructions
pause 