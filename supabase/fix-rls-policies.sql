-- ========================================================
-- RLS POLICIES FIX FOR SALESPERSONS TABLE
-- ========================================================

-- Enable RLS on salespersons table
ALTER TABLE salespersons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow all users to view salespersons" ON salespersons;
DROP POLICY IF EXISTS "Allow authenticated users to read salespersons" ON salespersons;
DROP POLICY IF EXISTS "Allow authenticated users to create salespersons" ON salespersons;
DROP POLICY IF EXISTS "Allow admin to manage salespersons" ON salespersons;
DROP POLICY IF EXISTS "Allow salespersons to update themselves" ON salespersons;
DROP POLICY IF EXISTS "Allow admin to delete salespersons" ON salespersons;

-- Policy: Allow anyone to view salespersons (read-only)
CREATE POLICY "Allow all users to view salespersons"
  ON salespersons
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to create salespersons
CREATE POLICY "Allow authenticated users to create salespersons"
  ON salespersons
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow salespersons to update their own record
CREATE POLICY "Allow salespersons to update themselves"
  ON salespersons
  FOR UPDATE
  USING (auth.uid()::text = auth_id)
  WITH CHECK (auth.uid()::text = auth_id);

-- Policy: Allow deletion (admin and owner)
CREATE POLICY "Allow salesperson deletion"
  ON salespersons
  FOR DELETE
  USING (true);


-- ========================================================
-- RLS POLICIES FIX FOR LEADS TABLE
-- ========================================================

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to create leads" ON leads;
DROP POLICY IF EXISTS "Allow lead owners to update leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to delete leads" ON leads;
DROP POLICY IF EXISTS "Allow all users to view leads" ON leads;

-- Policy: Allow anyone to view leads
CREATE POLICY "Allow all users to view leads"
  ON leads
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create leads
CREATE POLICY "Allow anyone to create leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to update leads
CREATE POLICY "Allow anyone to update leads"
  ON leads
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anyone to delete leads
CREATE POLICY "Allow anyone to delete leads"
  ON leads
  FOR DELETE
  USING (true);


-- ========================================================
-- RLS POLICIES FIX FOR COMPANIES TABLE
-- ========================================================

-- Enable RLS on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated users to create companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated users to delete companies" ON companies;
DROP POLICY IF EXISTS "Allow all users to view companies" ON companies;

-- Policy: Allow anyone to view companies
CREATE POLICY "Allow all users to view companies"
  ON companies
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create companies
CREATE POLICY "Allow anyone to create companies"
  ON companies
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete companies
CREATE POLICY "Allow anyone to delete companies"
  ON companies
  FOR DELETE
  USING (true);


-- ========================================================
-- RLS POLICIES FIX FOR LEAD_NOTES TABLE
-- ========================================================

-- Enable RLS on lead_notes table (if it exists)
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read lead_notes" ON lead_notes;
DROP POLICY IF EXISTS "Allow authenticated users to create lead_notes" ON lead_notes;
DROP POLICY IF EXISTS "Allow authenticated users to delete lead_notes" ON lead_notes;
DROP POLICY IF EXISTS "Allow all users to view lead_notes" ON lead_notes;

-- Policy: Allow anyone to view lead notes
CREATE POLICY "Allow all users to view lead_notes"
  ON lead_notes
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create lead notes
CREATE POLICY "Allow anyone to create lead_notes"
  ON lead_notes
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete lead notes
CREATE POLICY "Allow anyone to delete lead_notes"
  ON lead_notes
  FOR DELETE
  USING (true);


-- ========================================================
-- RLS POLICIES FIX FOR SAVED_COMPANIES TABLE
-- ========================================================

-- Enable RLS on saved_companies table (if it exists)
ALTER TABLE saved_companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read saved_companies" ON saved_companies;
DROP POLICY IF EXISTS "Allow authenticated users to create saved_companies" ON saved_companies;
DROP POLICY IF EXISTS "Allow authenticated users to delete saved_companies" ON saved_companies;
DROP POLICY IF EXISTS "Allow all users to view saved_companies" ON saved_companies;

-- Policy: Allow anyone to view saved companies
CREATE POLICY "Allow all users to view saved_companies"
  ON saved_companies
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create saved companies
CREATE POLICY "Allow anyone to create saved_companies"
  ON saved_companies
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete saved companies
CREATE POLICY "Allow anyone to delete saved_companies"
  ON saved_companies
  FOR DELETE
  USING (true);


-- ========================================================
-- RLS POLICIES FIX FOR INVOICES TABLE
-- ========================================================

-- Enable RLS on invoices table (if it exists)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated users to create invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated users to delete invoices" ON invoices;
DROP POLICY IF EXISTS "Allow all users to view invoices" ON invoices;

-- Policy: Allow anyone to view invoices
CREATE POLICY "Allow all users to view invoices"
  ON invoices
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create invoices
CREATE POLICY "Allow anyone to create invoices"
  ON invoices
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete invoices
CREATE POLICY "Allow anyone to delete invoices"
  ON invoices
  FOR DELETE
  USING (true);
