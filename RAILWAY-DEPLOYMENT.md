# 🚂 Railway Deployment Guide

This guide will help you deploy PostPerfect to Railway in under 10 minutes.

## 📋 Prerequisites

1. A [Railway account](https://railway.app/) (sign up with GitHub)
2. Your GitHub repository for PostPerfect
3. An Anthropic Claude API key

**Note**: The project uses .NET 10.0. Railway deployment uses Docker with .NET 10 preview images.

## 🚀 Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create a New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your PostPerfect repository
5. Railway will detect your project

### 3. Deploy the Backend (API)

1. Railway will create a service automatically
2. Click on the service, then go to **Settings**
3. Set the following:
   - **Root Directory**: `PostPerfect.Api`
   - **Builder**: Railway will use the Dockerfile automatically
   - **Build Command**: (leave empty)
   - **Start Command**: (leave empty)

4. Go to **Variables** tab and add:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   Claude__ApiKey=your-claude-api-key-here
   Claude__Model=claude-sonnet-4-20250514
   Claude__MaxTokens=500
   FrontendUrl=https://your-frontend-url.railway.app
   ```

   Note: You'll update `FrontendUrl` after deploying the frontend.

5. Click **Deploy** - Railway will build and deploy your API

6. Once deployed, go to **Settings** → **Networking** → **Generate Domain**
   - Copy this URL (e.g., `https://postperfect-api.railway.app`)
   - This is your **Backend URL**

### 4. Deploy the Frontend

1. In your Railway project, click **"+ New Service"**
2. Select **"GitHub Repo"** → Choose the same repository
3. Configure the service:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: (leave empty - uses Dockerfile)

4. Go to **Variables** tab and add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

   Replace `your-backend-url` with the Backend URL from step 3.

5. Click **Deploy**

6. Once deployed, go to **Settings** → **Networking** → **Generate Domain**
   - Copy this URL (e.g., `https://postperfect.railway.app`)
   - This is your **Frontend URL**

### 5. Update Backend CORS Settings

1. Go back to your **Backend service**
2. Navigate to **Variables**
3. Update the `FrontendUrl` variable with your Frontend URL:
   ```
   FrontendUrl=https://postperfect.railway.app
   ```

4. Railway will automatically redeploy the backend

### 6. Test Your Deployment

1. Visit your frontend URL
2. Upload a photo and test the analysis
3. Check the Railway logs if anything goes wrong

## 🔧 Environment Variables Reference

### Backend (PostPerfect.Api)
| Variable | Description | Required |
|----------|-------------|----------|
| `ASPNETCORE_ENVIRONMENT` | Set to `Production` | Yes |
| `Claude__ApiKey` | Your Anthropic API key | Yes |
| `Claude__Model` | Claude model to use | Yes |
| `Claude__MaxTokens` | Max tokens for responses | Yes |
| `FrontendUrl` | Your frontend Railway URL | Yes |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Your backend Railway URL + `/api` | Yes |

## 💰 Expected Costs

- **Free Trial**: Railway gives you $5 in free credits
- **After Trial**: ~$5/month for both services
- **Usage-based**: You pay only for what you use

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FrontendUrl` in backend matches your frontend domain exactly
- Check that both services are deployed and running

### API Not Responding
- Check Railway logs in the backend service
- Verify `Claude__ApiKey` is set correctly
- Ensure the backend service has generated a domain

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend service is running and accessible
- Inspect browser console for specific errors

### Rate Limiting Issues
- The API is limited to 10 requests per user per minute
- Check Railway logs to see if rate limits are being hit

## 📊 Monitoring

Railway provides built-in monitoring:
1. **Metrics**: View CPU, Memory, Network usage
2. **Logs**: Real-time logs from both services
3. **Deployments**: Track all deployment history

## 🔐 Security Best Practices

1. Never commit your `.env` files
2. Use Railway's environment variables for secrets
3. Regenerate your Claude API key if exposed
4. Monitor your Railway usage dashboard regularly

## 🚀 Next Steps

- Set up a custom domain (optional)
- Configure GitHub auto-deployments
- Add monitoring/alerting
- Set up staging environment

## 🆘 Need Help?

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- Check Railway logs for error details

---

**Estimated Deployment Time**: 10-15 minutes
**Monthly Cost**: ~$5 after free credits
**Difficulty**: ⭐ Easy
