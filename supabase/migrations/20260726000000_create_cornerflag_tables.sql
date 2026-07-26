-- Migration: Create Corner Flag Tables (Bankrolls & Bets)
-- Created: 2026-07-26

-- 1. Create Bankrolls Table
CREATE TABLE IF NOT EXISTS public.bankrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  initial_balance NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
  current_balance NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Bets Table
CREATE TABLE IF NOT EXISTS public.bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bankroll_id UUID NOT NULL REFERENCES public.bankrolls(id) ON DELETE CASCADE,
  match TEXT NOT NULL,
  league TEXT NOT NULL DEFAULT 'Geral',
  market TEXT NOT NULL DEFAULT 'CORNERS_OVER_UNDER',
  selection TEXT NOT NULL,
  odd NUMERIC(6, 3) NOT NULL,
  closing_odd NUMERIC(6, 3),
  stake NUMERIC(10, 2) NOT NULL,
  estimated_probability NUMERIC(5, 4),
  result TEXT NOT NULL DEFAULT 'PENDING', -- WIN, HALF_WIN, VOID, HALF_LOSS, LOSS, CASHOUT, PENDING
  profit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payout NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_bankrolls_user_id ON public.bankrolls(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_bankroll_id ON public.bets(bankroll_id);
CREATE INDEX IF NOT EXISTS idx_bets_result ON public.bets(result);
CREATE INDEX IF NOT EXISTS idx_bets_created_at ON public.bets(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bankrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow users to manage their own bankrolls
CREATE POLICY "Users can manage their own bankrolls" 
  ON public.bankrolls 
  FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to manage bets belonging to their bankrolls
CREATE POLICY "Users can manage their own bets" 
  ON public.bets 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.bankrolls 
      WHERE bankrolls.id = bets.bankroll_id 
        AND (bankrolls.user_id = auth.uid() OR bankrolls.user_id IS NULL)
    )
  );
