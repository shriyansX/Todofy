@echo off
echo 🚀 Starting Todofy Deployment...
echo.
echo 📦 Pushing latest changes to GitHub...
git add .
git commit -m "chore: final deployment sync"
git push origin main
echo.
echo ☁️ Triggering Vercel Deployment...
vercel --prod --yes
echo.
echo ✅ Done! If the command failed, please run 'vercel login' first.
pause
