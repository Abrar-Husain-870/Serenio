# Deploying MindEase Backend to Render with Gemini API

## Prerequisites
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ensure you have access to your Render dashboard

## Step-by-Step Deployment

### 1. Update Environment Variables in Render
1. Go to your Render dashboard
2. Select your `mindease-backend` service
3. Go to **Environment** tab
4. Update/Add these variables:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
5. Remove these old variables if they exist:
   ```
   HUGGINGFACE_API_KEY
   OLLAMA_BASE_URL
   ```

### 2. Trigger a New Deployment
1. In your Render service dashboard, click **Manual Deploy**
2. Select **Deploy latest commit**
3. Wait for the build to complete (should be much faster now!)

### 3. Verify the Deployment
1. Check the build logs for any errors
2. Test the chatbot endpoint: `POST /api/chatbot/query`
3. Test the quotes endpoint: `GET /api/quotes/positive`

## Expected Improvements

- **Build Time**: 50-70% faster (no more RAG initialization)
- **Startup Time**: 30-50% faster (no Ollama dependency)
- **Response Time**: 60-80% faster (Gemini API vs local Ollama)
- **Reliability**: Much more stable (cloud service vs local server)

## Troubleshooting

### If you get API key errors:
- Verify your Gemini API key is correct
- Check that the environment variable is set in Render
- Ensure the key has proper permissions

### If the chatbot doesn't respond:
- Check the Render logs for errors
- Verify the Gemini API is accessible from Render's servers
- Test with a simple query first

### If the build still takes long:
- Ensure the `postinstall` script was removed from package.json
- Check that all RAG-related dependencies were removed
- Verify the build command is just `tsc`

## Rollback Plan

If something goes wrong, you can:
1. Revert to the previous commit in Render
2. Restore the old environment variables
3. The app will continue working with the previous setup

## Support

For issues with:
- **Render deployment**: Check Render's documentation
- **Gemini API**: Check Google AI Studio documentation
- **App functionality**: Check the application logs in Render
