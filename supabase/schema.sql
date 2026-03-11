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
