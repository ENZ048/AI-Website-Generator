#!/bin/bash

echo "🚀 Preparing for Render Deployment..."
echo ""

echo "📋 Checklist before deployment:"
echo "1. ✅ Code pushed to GitHub"
echo "2. ✅ OpenAI API key ready"
echo "3. ✅ Render account created"
echo ""

echo "🔧 Next steps:"
echo "1. Go to https://render.com"
echo "2. Create Web Service for backend (analyzer-api)"
echo "3. Create Static Site for frontend (website-generator-ui)"
echo "4. Follow the DEPLOYMENT.md guide"
echo ""

echo "📁 Files created for you:"
echo "- render.yaml (Render configuration)"
echo "- DEPLOYMENT.md (Step-by-step guide)"
echo "- Updated config.jsx (Uses environment variables)"
echo "- Updated index.js (Production CORS + health check)"
echo ""

echo "🎯 Quick deployment order:"
echo "1. Deploy BACKEND first"
echo "2. Copy backend URL"
echo "3. Deploy FRONTEND with backend URL"
echo "4. Update backend CORS with frontend URL"
echo ""

echo "💡 Pro tip: Use the render.yaml file for automatic deployment!"
echo "   Or follow the manual steps in DEPLOYMENT.md"
