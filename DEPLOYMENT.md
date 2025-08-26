# Render Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Render account (free at render.com)
3. OpenAI API key

## Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. The `render.yaml` file is already configured

## Step 2: Deploy Backend API
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `ai-website-analyzer-api`
   - **Root Directory**: Leave empty (will use root)
   - **Build Command**: `cd analyzer-api && npm install`
   - **Start Command**: `cd analyzer-api && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `OPENAI_API_KEY`: Your actual OpenAI API key
   - `CORS_ORIGIN`: Will be set after frontend deployment

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the URL (e.g., `https://ai-website-analyzer-api.onrender.com`)

## Step 3: Deploy Frontend
1. In Render dashboard, click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the service:
   - **Name**: `ai-website-generator-ui`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd website-generator-ui && npm install && npm run build`
   - **Publish Directory**: `website-generator-ui/dist`
   - **Plan**: Free

4. Add Environment Variable:
   - `VITE_API_BASE_URL`: Your backend URL from Step 2

5. Click "Create Static Site"
6. Wait for deployment to complete
7. Copy the frontend URL

## Step 4: Update CORS in Backend
1. Go back to your backend service in Render
2. Add/update environment variable:
   - `CORS_ORIGIN`: Your frontend URL from Step 3
3. Redeploy the backend service

## Step 5: Test Your Deployment
1. Visit your frontend URL
2. Try the website analysis feature
3. Check that it connects to your backend API

## Troubleshooting
- If build fails, check the build logs in Render
- Make sure all dependencies are in package.json
- Verify environment variables are set correctly
- Check that your OpenAI API key is valid

## Moving to AWS Later
When you're ready to move to AWS:
1. You can keep the same code structure
2. Update deployment scripts for AWS services
3. Consider splitting into separate repos if needed
4. Use AWS CodeDeploy, Elastic Beanstalk, or ECS
