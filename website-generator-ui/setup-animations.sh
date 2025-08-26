#!/bin/bash

echo "🎬 Setting up Creative Loading Animations..."
echo ""

echo "📦 Installing required packages..."
npm install lottie-react canvas-confetti --save

echo ""
echo "📁 Creating animations folder..."
mkdir -p src/assets/animations

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Place your Lottie animation files in: src/assets/animations/"
echo "   - ai-loading.json"
echo "   - star-loader-2.json" 
echo "   - technology.json"
echo ""
echo "2. Make sure the filenames match exactly what's imported in CreativeLoader.jsx"
echo ""
echo "3. Run your app: npm run dev"
echo ""
echo "🎉 Your creative loading sequence is ready!"
