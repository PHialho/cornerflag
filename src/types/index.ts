import type { BetResult } from '../lib/math/calculator';

export type BetType = 'SIMPLE' | 'MULTIPLE';

export interface BetLeg {
  id?: string;
  match: string;
  league?: string;
  sport?: string;
  market?: string;
  selection: string;
  odd: number;
}

export interface Bankroll {
  id: string;
  user_id?: string;
  name: string;
  currency: string;
  initial_balance: number;
  current_balance: number;
  is_default?: boolean;
  created_at: string;
}

export interface Bet {
  id: string;
  bankroll_id: string;
  bet_type?: BetType;
  sport?: string;
  strategy?: string;
  match: string;
  league: string;
  market: string;
  selection: string;
  odd: number;
  closing_odd?: number;
  stake: number;
  estimated_probability?: number;
  result: BetResult | 'PENDING';
  profit: number;
  payout: number;
  notes?: string;
  legs?: BetLeg[];
  settled_at?: string;
  created_at: string;
}
