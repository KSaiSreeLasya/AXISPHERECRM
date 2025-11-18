# Render Deployment Setup Guide

## Prerequisites

- A Render account (https://render.com)
- Your Supabase credentials ready
- An existing Render Web Service

## Step 1: Get Your Supabase Credentials

1. Go to your **Supabase Project Dashboard**
2. Click **Settings** → **API** (left sidebar)
3. Copy these values:

   - **Project URL** (example: `https://abcdefghijklmn.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role secret** key (starts with `eyJ...`)

⚠️ **Keep these secret!** Never commit them to version control.

## Step 2: Set Environment Variables on Render

1. Go to your Render Web Service dashboard
2. Click **Environment** (left sidebar)
3. Add these environment variables:

   - **VITE_SUPABASE_URL**: Your Supabase Project URL
   - **VITE_SUPABASE_ANON_KEY**: Your anon public key
   - **SUPABASE_SERVICE_ROLE_KEY**: Your service_role secret key

4. Click **Save**

Render will automatically redeploy your app with the new environment variables.

## Step 3: Monitor Deployment

You can watch the deployment in real-time:

1. Go to your Render Web Service dashboard
2. Click **Logs** to see deployment progress
3. You should see output like:

```
Starting Fusion server...
Environment variables:
  NODE_ENV: production
  PORT: 10000
  VITE_SUPABASE_URL: ✓ Set
  VITE_SUPABASE_ANON_KEY: ✓ Set
  SUPABASE_SERVICE_ROLE_KEY: ✓ Set

🚀 Fusion Starter server running on port 10000
API endpoints available:
  - POST /api/auth/sign-in
  - POST /api/auth/sign-up
  ...
```

If you see `✗ MISSING` for any variable, go back to Step 2 and add them again.

## Step 4: Test Login

1. Open your Render app URL (example: `https://my-app.onrender.com`)
2. Try logging in with your credentials
3. Test creating and deleting a salesperson

## Troubleshooting

### "Server configuration error" when logging in

- The environment variables are not set
- Go to your Render service → Environment
- Verify all three variables are present and correct
- If you added new variables, Render will automatically redeploy

### "Email already registered" error

- This is expected if the email exists in Supabase Auth
- Use a different email, or delete the user from Supabase Auth first

### "Failed to delete salesperson"

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- The service role key is different from the anon key
- Check in Supabase: Settings → API → Service Role (under "Project API keys")

### API endpoints returning 404

- The build may have failed
- Check the build logs in Render dashboard
- Make sure the build completed successfully
- Render will redeploy automatically when you update environment variables

## Updating Environment Variables

If you need to change a variable later:

1. Go to your Render service → Environment
2. Click the variable to edit it
3. Save the changes
4. Render will automatically redeploy

To remove a variable, click the trash icon next to it.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Project README](./README.md)
