# Fly.io Deployment Setup Guide

## Prerequisites

- Fly.io CLI installed (`flyctl`)
- Your Supabase credentials ready
- An existing Fly.io app

## Step 1: Get Your Supabase Credentials

1. Go to your **Supabase Project Dashboard**
2. Click **Settings** → **API** (left sidebar)
3. Copy these values:

   - **Project URL** (example: `https://abcdefghijklmn.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role secret** key (starts with `eyJ...`)

⚠️ **Keep these secret!** Never commit them to version control.

## Step 2: Set Environment Variables on Fly.io

Run this command in your terminal:

```bash
flyctl secrets set \
  VITE_SUPABASE_URL="https://your-project.supabase.co" \
  VITE_SUPABASE_ANON_KEY="your-anon-key-here" \
  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

Replace the values with your actual Supabase credentials from Step 1.

## Step 3: Verify Secrets Are Set

Run this command to confirm:

```bash
flyctl secrets list
```

You should see all three secrets listed.

## Step 4: Redeploy Your Application

```bash
flyctl deploy
```

This will rebuild and redeploy your app with the new environment variables.

## Step 5: Check Deployment Logs

Monitor the deployment:

```bash
flyctl logs
```

You should see output like:

```
Starting Fusion server...
Environment variables:
  NODE_ENV: production
  PORT: 8080
  VITE_SUPABASE_URL: ✓ Set
  VITE_SUPABASE_ANON_KEY: ✓ Set
  SUPABASE_SERVICE_ROLE_KEY: ✓ Set

🚀 Fusion Starter server running on port 8080
API endpoints available:
  - POST /api/auth/sign-in
  - POST /api/auth/sign-up
  ...
```

If you see `✗ MISSING` for any variable, go back to Step 2 and set them again.

## Step 6: Test Login

1. Open your Fly.io app URL (example: `https://my-app.fly.dev`)
2. Try logging in with your credentials
3. Test creating and deleting a salesperson

## Troubleshooting

### "Server configuration error" when logging in

- The environment variables are not set
- Run `flyctl secrets list` to verify
- Go back to Step 2 and set the missing secrets
- Run `flyctl deploy` to redeploy

### "Email already registered" error

- This is expected if the email exists in Supabase Auth
- Use a different email, or delete the user from Supabase Auth first

### "Failed to delete salesperson"

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- The service role key is different from the anon key
- Check in Supabase: Settings → API → Service Role (under "Project API keys")

### API endpoints returning 404

- The build may have failed
- Check the deploy logs: `flyctl logs`
- Make sure the build completed successfully
- Try deploying again: `flyctl deploy`

## Updating Environment Variables

If you need to change a secret later:

```bash
flyctl secrets set VITE_SUPABASE_URL="new-url"
```

Or remove one:

```bash
flyctl secrets unset VITE_SUPABASE_URL
```

After changing secrets, redeploy:

```bash
flyctl deploy
```

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Project README](./README.md)
