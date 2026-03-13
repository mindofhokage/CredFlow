-- CredFlow Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  billing_start_day INTEGER NOT NULL DEFAULT 1 CHECK (billing_start_day BETWEEN 1 AND 28),
  image_url TEXT,
  last_four TEXT CHECK (last_four IS NULL OR length(last_four) = 4),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  category TEXT NOT NULL DEFAULT 'autre',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, disable for personal use)
-- ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Migration: add is_paid column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- Migration: add network column
ALTER TABLE cards ADD COLUMN IF NOT EXISTS network TEXT CHECK (network IN ('visa', 'mastercard', 'amex')) DEFAULT NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS expenses_card_id_idx ON expenses(card_id);
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);

-- ── Auth & Row Level Security ─────────────────────────────────────────────────

-- Migration: add user_id to cards (links each card to a Supabase auth user)
ALTER TABLE cards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Cards policies: users can only see/modify their own cards
CREATE POLICY IF NOT EXISTS "cards_select_own" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "cards_insert_own" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "cards_update_own" ON cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "cards_delete_own" ON cards FOR DELETE USING (auth.uid() = user_id);

-- Expenses policies: access via card ownership
CREATE POLICY IF NOT EXISTS "expenses_select_own" ON expenses FOR SELECT
  USING (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "expenses_insert_own" ON expenses FOR INSERT
  WITH CHECK (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "expenses_update_own" ON expenses FOR UPDATE
  USING (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "expenses_delete_own" ON expenses FOR DELETE
  USING (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));
