# MindEase Deployment Guide

This guide will help you deploy the MindEase application to production.

## Backend Deployment (Render)

1. Create a Render account at https://render.com

2. Create a new Web Service:
   - Connect your GitHub repository
   - Select the `mindease-backend` directory
   - Set the following:
     - Name: mindease-backend
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Node Version: 18.x

3. Add Environment Variables in Render:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=your_frontend_url
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OLLAMA_BASE_URL=your_ollama_url
   ```

4. Deploy the service

## Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com

2. Import your GitHub repository:
   - Select the `mindease-frontend` directory
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. Add Environment Variables in Vercel:
   ```
   VITE_API_URL=your_backend_url
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Deploy the application

## MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

2. Create a new cluster

3. Set up database access:
   - Create a database user
   - Set up IP whitelist

4. Get your connection string and update the `MONGODB_URI` in your backend environment variables

## Ollama Setup (for AI Chatbot)

1. Set up Ollama on your server or use a cloud service
2. Update the `OLLAMA_BASE_URL` in your backend environment variables

## Post-Deployment Checklist

1. Test all authentication flows
2. Verify API endpoints
3. Check AI chatbot functionality
4. Test file uploads and storage
5. Monitor application logs
6. Set up error tracking
7. Configure SSL certificates
8. Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. CORS errors:
   - Verify FRONTEND_URL in backend environment variables
   - Check CORS configuration in backend

2. Authentication issues:
   - Verify Google OAuth credentials
   - Check JWT configuration

3. Database connection:
   - Verify MongoDB connection string
   - Check IP whitelist settings

4. AI features:
   - Verify Ollama service is running
   - Check HuggingFace API key

### Support

For deployment issues, please:
1. Check the application logs
2. Verify environment variables
3. Test endpoints using Postman
4. Review server configurations 