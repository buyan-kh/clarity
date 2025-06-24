# Deployment Guide

## Overview
This app consists of:
- **Frontend + Backend**: Next.js app with serverless API functions in `/front` directory
- **Mobile**: React Native app in `/mobile` directory

## Free Deployment Setup

### Single Deployment (Vercel - Recommended)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework**: Next.js
   - **Root Directory**: `front`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add environment variable:
   - `GEMINI_API_KEY`: Your Google AI API key
5. Deploy

### Environment Variables

**Vercel Environment Variables:**
```
GEMINI_API_KEY=your_google_ai_api_key_here
```

### 4. Getting API Keys

1. **Google AI API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new project
   - Generate API key
   - Add to backend environment variables

## User Data Persistence

The app now includes:
- **localStorage** for user preferences, goals, and schedules
- **Utilities** in `/front/lib/storage.ts` for data management
- **Automatic saving** of user data across sessions

## API Endpoints

Your deployed app will have these endpoints:
- `POST /api/generate-schedule` - Generate daily schedule
- `POST /api/generate-roadmap` - Generate 6-month roadmap

## Local Development

```bash
cd front
npm install
npm run dev  # Starts Next.js on localhost:3000
```

## Free Tier Limitations

- **Vercel**: 100GB bandwidth, 1000 serverless function invocations per month
- **Storage**: Client-side only (localStorage)

## Upgrade Options

For production use, consider:
- **Database**: Supabase, PlanetScale, or MongoDB Atlas
- **Vercel Pro**: Better performance and higher limits