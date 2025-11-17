-- Add is_deleted column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Add is_deleted column to salespersons table
ALTER TABLE salespersons ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_is_deleted ON leads(is_deleted);
CREATE INDEX IF NOT EXISTS idx_salespersons_is_deleted ON salespersons(is_deleted);
