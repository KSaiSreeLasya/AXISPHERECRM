# Backend Setup Fix - Complete Guide

## Summary of Issues Fixed

1. ✅ **Server Environment Variables**: Now properly loading Supabase credentials
2. ✅ **Service Role Key**: Server now has access to bypass RLS policies
3. ✅ **Auth Error Handling**: Improved logging and error responses in `/api/auth/sign-in` and `/api/auth/sign-up`
4. ⏳ **RLS Policies**: Ready to be applied (see Step 1 below)

## Step 1: Apply RLS Policies in Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com/projects
2. Select project `pdklljdaliaqvudcqdqb`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire content from `supabase/fix-rls-policies.sql`
6. Click **Run** button to execute all policies
7. You should see success messages for all policy creations

**What these policies do:**

- Allow all users to VIEW salespersons, leads, companies, and other tables
- Allow authenticated users to CREATE new records
- Allow users to UPDATE and DELETE records (properly configured for authorization)
- This fixes the "Unexpected end of JSON input" errors

## Step 2: Verify Database Tables Exist

In Supabase SQL Editor, run this query to verify all required tables exist:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:

- `salespersons`
- `leads`
- `companies`
- `lead_notes`
- `saved_companies`
- `invoices`

If any are missing, run this to create them:

```sql
-- Create salespersons table
CREATE TABLE IF NOT EXISTS salespersons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  email TEXT,
  phone_numbers TEXT[],
  actions TEXT[],
  links TEXT[],
  locations TEXT[],
  company_employees TEXT,
  company_industries TEXT[],
  company_keywords TEXT[],
  assigned_to UUID REFERENCES salespersons(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'No Stage',
  note TEXT,
  next_reminder_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apollo_id TEXT UNIQUE,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  employee_count INTEGER,
  employee_count_range TEXT,
  revenue NUMERIC,
  revenue_range TEXT,
  logo_url TEXT,
  linkedin_url TEXT,
  crunchbase_url TEXT,
  founded_year INTEGER,
  hq_address TEXT,
  countries TEXT[],
  website TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create saved_companies table
CREATE TABLE IF NOT EXISTS saved_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apollo_id TEXT UNIQUE,
  company_name TEXT,
  saved_at TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  company_name TEXT,
  package_id TEXT,
  package_name TEXT,
  package_price NUMERIC,
  scope JSONB,
  paid_amount NUMERIC,
  additional_notes TEXT,
  tax_percentage NUMERIC DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Step 3: Verify Email/Password Auth is Enabled

1. Go to **Authentication** → **Providers** in Supabase
2. Find **Email** provider
3. Make sure the toggle is **ON** (enabled)
4. Set **Confirm email** to your preference (you can turn it OFF for testing)

## Step 4: Test the Flows

### Test 1: Register as Salesperson

1. Go to the Login page
2. Click "Create Account"
3. Fill in:
   - Full Name: `Test Salesperson`
   - Email: `salesperson@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
4. Click "Create Account"
5. **Expected Result**: You should be logged in and see the CRM dashboard

### Test 2: Add a Salesperson (Admin Only)

1. Login with admin credentials:
   - Email: `admin@axisphere.in`
   - Password: `admin2024`
2. Go to **Sales Persons** page
3. Click **Add Sales Person**
4. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+91-9876543210`
5. Click **Add Sales Person**
6. **Expected Result**: Salesperson added successfully

### Test 3: Delete a Salesperson

1. As admin, go to **Sales Persons** page
2. Find the salesperson card
3. Click the **Delete** (trash) icon
4. Confirm the deletion
5. **Expected Result**: Salesperson deleted successfully

### Test 4: Login as Salesperson

1. Logout (if logged in)
2. Go to Login page
3. Enter the credentials from Test 1:
   - Email: `salesperson@example.com`
   - Password: `TestPassword123!`
4. Click **Login**
5. **Expected Result**: You should be logged in as salesperson and see your dashboard

## Troubleshooting

### "Authentication error: Failed to execute 'json' on 'Response': Unexpected end of JSON input"

**Solution**: This error is fixed by applying the RLS policies in Step 1. Make sure:

1. You ran the SQL script from `supabase/fix-rls-policies.sql`
2. All policies were created successfully
3. Restart the page or clear browser cache

### "RLS policy violation"

**Solution**: Make sure the RLS policies were applied correctly:

1. Go to Supabase SQL Editor
2. Run this query:
   ```sql
   SELECT tablename, policyname FROM pg_policies
   WHERE tablename IN ('salespersons', 'leads', 'companies')
   ORDER BY tablename, policyname;
   ```
3. You should see multiple policies for each table
4. If empty, re-run the `fix-rls-policies.sql` script

### "Email already registered"

**Solution**: The email is already registered in Supabase Auth. You can:

1. Use a different email address
2. Or go to Supabase Auth → Users and delete the user, then try again

### "Could not fetch user profile"

**Solution**: The salesperson record wasn't created properly:

1. Go to Supabase Table Editor
2. Check the `salespersons` table
3. Verify that a record exists for the user
4. If not, create one manually with the correct `auth_id`

## Files Modified/Created

- `server/routes/auth.ts` - Improved error handling and logging
- `server/routes/leads.ts` - Fixed service role key loading
- `supabase/fix-rls-policies.sql` - RLS policy definitions (NEW)
- Environment variables set on server

## Next Steps

1. Follow Steps 1-4 above to complete the setup
2. Run the tests to verify everything works
3. If you encounter any issues, check the Troubleshooting section
4. Check browser console (F12) for detailed error logs

## Important Notes

- The admin login is hardcoded: `admin@axisphere.in` / `admin2024`
- Regular salespersons login through Supabase Auth
- All operations now have proper error handling and logging
- Server logs will show detailed information about auth attempts
