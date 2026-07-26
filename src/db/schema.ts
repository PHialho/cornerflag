import Dexie, { type Table } from 'dexie';
import type { BetResult } from '../lib/math/calculator';

export interface Bankroll {
  id?: number;
  name: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  isDefault?: boolean;
  createdAt: string;
}

export interface Bet {
  id?: number;
  bankrollId: number;
  match: string;
  league: string;
  market: 'OVER_UNDER' | 'HANDICAP' | 'MONEYLINE' | 'OTHER';
  selection: string;
  odd: number;
  closingOdd?: number;
  stake: number;
  estimatedProbability?: number; // 0.0 - 1.0
  result: BetResult | 'PENDING';
  profit: number;
  payout: number;
  notes?: string;
  settledAt?: string;
  createdAt: string;
}

export class CornerFlagDatabase extends Dexie {
  bankrolls!: Table<Bankroll>;
  bets!: Table<Bet>;

  constructor() {
    super('CornerFlagDB');
    this.version(1).stores({
      bankrolls: '++id, name, isDefault, createdAt',
      bets: '++id, bankrollId, market, result, createdAt, settledAt',
    });
  }
}

export const db = new CornerFlagDatabase();
