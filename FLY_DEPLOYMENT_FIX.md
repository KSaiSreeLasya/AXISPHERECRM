# Fixing "body stream already read" Error on Render

## Root Cause

The error occurs when Supabase client tries to parse a response body that has already been consumed. On Render deployments, this happens because:

1. The Express/Vite server is running in production mode
2. Response bodies are being intercepted or consumed before Supabase client can read them
3. Certain proxy configurations intercept HTTP responses

## Solution: Use Server-Side Auth Proxy (Recommended for Render)

The application now includes server-side auth routes that handle authentication, bypassing the client-side response body issue:

**Endpoints:**

- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-up` - Registration
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Check session

These endpoints read the response body once and reuse the data, preventing the "body stream already read" error.

## Testing Locally

1. Build the app:

   ```bash
   npm run build
   ```

2. Start production server:

   ```bash
   npm run start
   ```

3. Test authentication:
   - Go to `http://localhost:8080/`
   - Create account or login with credentials

## Deploying to Render

1. Push your code to GitHub

2. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Start command: `npm run start`

3. Set environment variables in Render Dashboard:
   - `VITE_SUPABASE_URL` - Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

4. Render will automatically build and deploy

## Detailed Setup Guide

See [RENDER_DEPLOYMENT_SETUP.md](./RENDER_DEPLOYMENT_SETUP.md) for step-by-step instructions and troubleshooting.

## Monitoring Logs

In Render Dashboard:

1. Go to your Web Service
2. Click **Logs** tab
3. Watch for deployment and runtime logs

## Alternative: Use a Different Deployment Platform

If needed, you can also deploy to:

- **Netlify**: Use the existing Netlify configuration
- **Vercel**: Excellent React/Node support
- **AWS Amplify**: Native AWS integration

Choose the platform that best fits your needs.
