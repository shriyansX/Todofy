# 🚀 Todofy Deployment Guide

This guide will walk you through deploying Todofy to production using Vercel and MongoDB Atlas.

## Prerequisites

- Vercel account (free)
- MongoDB Atlas account (free tier available)
- GitHub account (for source code hosting)

## Step 1: Setup MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Choose "Shared Clusters" (free)
   - Select your preferred cloud provider and region
   - Keep the default cluster name or choose your own

3. **Setup Database User**
   - Go to "Database Access" in the sidebar
   - Click "Add New Database User"
   - Create a user with username and password
   - Set permissions to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 2: Setup Vercel Deployment

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/todofy.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

3. **Configure Environment Variables**
   
   In Vercel dashboard, go to "Settings" > "Environment Variables" and add:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string | Production |
   | `NODE_ENV` | `production` | Production |
   | `REACT_APP_API_URL` | `https://your-app.vercel.app/api` | Production |

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - The deployment URL will be provided

### Option B: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   # Enter your MongoDB connection string
   
   vercel env add NODE_ENV
   # Enter: production
   
   vercel env add REACT_APP_API_URL
   # Enter: https://your-app.vercel.app/api (update with your actual domain)
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Production Settings

1. **Update API URL**
   - After deployment, note your Vercel app URL
   - Update `REACT_APP_API_URL` environment variable with the correct URL

2. **Test the Deployment**
   - Visit your deployed app
   - Create a test task
   - Verify it persists after refresh
   - Test all features (create, edit, delete, filters)

## Step 4: Custom Domain (Optional)

1. **Add Custom Domain in Vercel**
   - Go to your project in Vercel dashboard
   - Go to "Settings" > "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Point your domain's DNS to Vercel
   - Follow Vercel's instructions for your DNS provider

## Environment Variables Reference

### Production Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/todofy` | MongoDB Atlas connection |
| `NODE_ENV` | `production` | Environment mode |
| `REACT_APP_API_URL` | `https://todofy.vercel.app/api` | Frontend API URL |

### Development Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/todofy` | Local MongoDB connection |
| `NODE_ENV` | `development` | Environment mode |
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Local API URL |

## Troubleshooting

### Common Issues

1. **"Cannot connect to MongoDB"**
   - Check your MongoDB Atlas connection string
   - Verify the database user credentials
   - Ensure network access is configured for Vercel (0.0.0.0/0)

2. **"API calls failing"**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check Vercel function logs in dashboard
   - Ensure CORS is configured properly

3. **"Build failing"**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are listed in package.json
   - Ensure TypeScript types are correct

4. **"App not updating"**
   - Clear browser cache
   - Check if changes are committed and pushed to GitHub
   - Verify Vercel is deploying the latest commit

### Debug Commands

```bash
# Check Vercel deployment logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy
vercel --prod --force
```

## Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user with proper permissions
- [ ] Network access configured for Vercel
- [ ] Environment variables set in Vercel
- [ ] App deployed and accessible
- [ ] All features tested in production
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)

## Monitoring and Maintenance

1. **Monitor Performance**
   - Use Vercel Analytics for performance insights
   - Monitor MongoDB Atlas metrics

2. **Error Tracking**
   - Check Vercel function logs for errors
   - Monitor MongoDB Atlas alerts

3. **Updates**
   - Regularly update dependencies
   - Test updates in development before production
   - Use Vercel's preview deployments for testing

## Security Best Practices

1. **Environment Variables**
   - Never commit environment variables to git
   - Use strong passwords for database users
   - Regularly rotate database credentials

2. **Database Security**
   - Use MongoDB Atlas security features
   - Regular security updates
   - Monitor database access logs

3. **Application Security**
   - Keep dependencies updated
   - Use Vercel's security headers
   - Implement rate limiting (already included)

---

**Need Help?**

- Check [Vercel Documentation](https://vercel.com/docs)
- Read [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- Open an issue on GitHub