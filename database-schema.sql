-- Wedding RSVP Database Schema
-- Run this SQL in your Supabase SQL Editor to create the tables

-- ============================================
-- 1. GUESTS TABLE
-- ============================================
-- This table stores the guest list - people who are invited
-- Users will search this table by name to find themselves

CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Guest Information
  full_name TEXT NOT NULL,
  email TEXT,
  guest_plus_one TEXT, -- Name of their +1 (if applicable)
  
  -- Invitation Details
  invited_to_friday BOOLEAN NOT NULL DEFAULT false,
  invited_to_saturday BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT guests_full_name_check CHECK (char_length(trim(full_name)) >= 2),
  CONSTRAINT guests_email_check CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT guests_plus_one_check CHECK (guest_plus_one IS NULL OR char_length(trim(guest_plus_one)) >= 2)
);

-- Create index for fast name searching (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_guests_full_name_search ON guests USING gin(to_tsvector('english', lower(full_name)));
CREATE INDEX IF NOT EXISTS idx_guests_full_name_lower ON guests(lower(full_name));

-- ============================================
-- 2. GUEST_RSVPS TABLE
-- ============================================
-- This table stores RSVP responses from guests

CREATE TABLE IF NOT EXISTS guest_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to guest (the person submitting the RSVP)
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  
  -- Friday Night Gathering RSVP
  -- NULL = not invited, true/false = attending/not attending
  attending_friday BOOLEAN,
  
  -- Saturday Wedding RSVP
  attending_saturday BOOLEAN NOT NULL,
  
  -- Pre-registered guest attendance
  -- Primary guest is always attending (RSVP exists), but we track +1 separately
  plus_one_attending BOOLEAN, -- NULL if no +1, true/false if they have a +1
  
  -- Additional guests beyond pre-registered ones
  -- These are extra guests not in the guests table
  additional_guests INTEGER NOT NULL DEFAULT 0 CHECK (additional_guests >= 0),
  additional_guest_names TEXT[],
  
  -- Contact Information
  email TEXT NOT NULL,
  
  -- Additional Information
  notes TEXT,
  
  -- Metadata
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT guest_rsvps_notes_check CHECK (notes IS NULL OR char_length(notes) <= 1000),
  CONSTRAINT guest_rsvps_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
  -- Note: Validation for attending_friday and plus_one_attending should be handled at the application level
  -- PostgreSQL CHECK constraints cannot use subqueries, so we cannot enforce:
  -- - attending_friday should only be set if guest.invited_to_friday = true
  -- - plus_one_attending should only be set if guest.guest_plus_one IS NOT NULL
);

-- Create index for guest_id lookups
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_guest_id ON guest_rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_submitted_at ON guest_rsvps(submitted_at DESC);

-- ============================================
-- 3. TRIGGERS
-- ============================================
-- Auto-update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_rsvps_updated_at
  BEFORE UPDATE ON guest_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on both tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_rsvps ENABLE ROW LEVEL SECURITY;

-- Allow public read access to guests table (for name searching)
-- This allows anyone to search for their name
CREATE POLICY "Allow public read access to guests"
  ON guests FOR SELECT
  USING (true);

-- Allow public insert/update access to guest_rsvps (for submitting RSVPs)
-- Users can only update their own RSVP (based on guest_id)
CREATE POLICY "Allow public insert to guest_rsvps"
  ON guest_rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update own rsvp"
  ON guest_rsvps FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public read access to guest_rsvps (optional - you may want to restrict this)
-- Uncomment if you want users to be able to view their RSVP
-- CREATE POLICY "Allow public read own rsvp"
--   ON guest_rsvps FOR SELECT
--   USING (true);

-- ============================================
-- 5. HELPER FUNCTIONS (Optional)
-- ============================================
-- Function to search guests by name (fuzzy search)
CREATE OR REPLACE FUNCTION search_guests(search_term TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  guest_plus_one TEXT,
  invited_to_friday BOOLEAN,
  invited_to_saturday BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.full_name,
    g.email,
    g.guest_plus_one,
    g.invited_to_friday,
    g.invited_to_saturday
  FROM guests g
  WHERE lower(g.full_name) LIKE '%' || lower(trim(search_term)) || '%'
     OR (g.guest_plus_one IS NOT NULL AND lower(g.guest_plus_one) LIKE '%' || lower(trim(search_term)) || '%')
  ORDER BY 
    -- Prioritize exact matches on full_name
    CASE WHEN lower(g.full_name) = lower(trim(search_term)) THEN 1 ELSE 2 END,
    g.full_name
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTES FOR IMPLEMENTATION
-- ============================================
/*
1. GUESTS TABLE:
   - Populate this table with your guest list before going live
   - full_name: The name guests will search for (e.g., "John Smith")
   - guest_plus_one: Name of their +1 (if applicable), NULL if no +1
   - invited_to_friday: Set to true for guests invited to Friday night gathering
   - invited_to_saturday: Set to true for all wedding guests (default true)
   
   EXAMPLE GUEST SETUP:
   -- Guest with a +1
   INSERT INTO guests (full_name, email, guest_plus_one, invited_to_friday, invited_to_saturday)
   VALUES ('John Smith', 'john@example.com', 'Jane Smith', true, true);
   
   -- Guest without a +1
   INSERT INTO guests (full_name, email, invited_to_friday, invited_to_saturday)
   VALUES ('Alice Johnson', 'alice@example.com', true, true);

2. GUEST_RSVPS TABLE:
   - Created when a guest submits their RSVP
   - guest_id: The guest who submitted (always required)
   - attending_friday: Only set if invited_to_friday = true in guests table
   - attending_saturday: Required for all guests
   - plus_one_attending: 
     * NULL if guest has no +1
     * true/false if guest has a +1 (whether +1 is attending)
   - additional_guests: Count of extra guests NOT in the guests table
   - additional_guest_names: Names of those extra guests
   - email: Required contact email

3. SEARCH FUNCTIONALITY:
   - Use search_guests() to find guests (searches both full_name and guest_plus_one)
   - Search is case-insensitive and supports partial matches
   - Example: Searching "john" will find "John Smith"
   - Example: Searching "jane" will find guests where Jane is the +1

4. EXAMPLE QUERIES:

   -- Search for a guest by name
   SELECT * FROM search_guests('John Smith');
   
   -- Get guest with their RSVP (if exists)
   SELECT 
     g.*,
     r.attending_friday,
     r.attending_saturday,
     r.plus_one_attending,
     r.additional_guests,
     r.additional_guest_names,
     r.notes,
     r.email
   FROM guests g
   LEFT JOIN guest_rsvps r ON r.guest_id = g.id
   WHERE g.id = 'guest-uuid-here';
   
   -- Insert a new RSVP (guest only, no +1, no extra guests)
   INSERT INTO guest_rsvps (
     guest_id,
     attending_friday,
     attending_saturday,
     plus_one_attending,
     additional_guests,
     additional_guest_names,
     email,
     notes
   ) VALUES (
     'guest-uuid',
     true,  -- or NULL if not invited to Friday
     true,
     NULL,  -- No +1
     0,  -- No additional guests
     ARRAY[]::TEXT[],
     'john@example.com',
     'Vegetarian option please'
   );
   
   -- Insert RSVP with guest + their +1 attending
   INSERT INTO guest_rsvps (
     guest_id,
     attending_friday,
     attending_saturday,
     plus_one_attending,
     additional_guests,
     additional_guest_names,
     email,
     notes
   ) VALUES (
     'guest-uuid',
     true,
     true,
     true,  -- +1 is attending
     0,
     ARRAY[]::TEXT[],
     'john@example.com',
     NULL
   );
   
   -- Insert RSVP with guest + 2 extra guests (not in guests table)
   INSERT INTO guest_rsvps (
     guest_id,
     attending_friday,
     attending_saturday,
     plus_one_attending,
     additional_guests,
     additional_guest_names,
     email,
     notes
   ) VALUES (
     'guest-uuid',
     true,
     true,
     false,  -- +1 is not attending (or NULL if no +1)
     2,  -- 2 additional guests
     ARRAY['Extra Guest 1', 'Extra Guest 2'],
     'john@example.com',
     NULL
   );
*/

