import { create } from 'zustand';
import { db, type Bankroll, type Bet } from '../db/schema';
import { settleBet, type BetResult } from '../lib/math/calculator';

interface CornerFlagState {
  bankrolls: Bankroll[];
  activeBankrollId: number | null;
  bets: Bet[];
  isLoading: boolean;
  
  // Actions
  loadInitialData: () => Promise<void>;
  setActiveBankroll: (id: number) => void;
  createBankroll: (name: string, initialBalance: number, currency?: string) => Promise<void>;
  addBet: (betData: Omit<Bet, 'id' | 'createdAt' | 'profit' | 'payout'>) => Promise<void>;
  settleBetResult: (betId: number, result: BetResult, cashoutAmount?: number) => Promise<void>;
}

export const useCornerFlagStore = create<CornerFlagState>((set, get) => ({
  bankrolls: [],
  activeBankrollId: null,
  bets: [],
  isLoading: true,

  loadInitialData: async () => {
    set({ isLoading: true });
    let allBankrolls = await db.bankrolls.toArray();

    // Default Bankroll creation if empty
    if (allBankrolls.length === 0) {
      const defaultId = await db.bankrolls.add({
        name: 'Banca Principal',
        currency: 'EUR',
        initialBalance: 1000,
        currentBalance: 1000,
        isDefault: true,
        createdAt: new Date().toISOString(),
      });
      allBankrolls = await db.bankrolls.toArray();
      set({ activeBankrollId: defaultId as number });
    } else {
      const defaultB = allBankrolls.find((b) => b.isDefault) || allBankrolls[0];
      set({ activeBankrollId: defaultB.id! });
    }

    const activeId = get().activeBankrollId;
    const bets = activeId
      ? await db.bets.where('bankrollId').equals(activeId).reverse().toArray()
      : [];

    set({ bankrolls: allBankrolls, bets, isLoading: false });
  },

  setActiveBankroll: async (id: number) => {
    set({ activeBankrollId: id, isLoading: true });
    const bets = await db.bets.where('bankrollId').equals(id).reverse().toArray();
    set({ bets, isLoading: false });
  },

  createBankroll: async (name: string, initialBalance: number, currency: string = 'EUR') => {
    const newId = await db.bankrolls.add({
      name,
      currency,
      initialBalance,
      currentBalance: initialBalance,
      createdAt: new Date().toISOString(),
    });
    await get().loadInitialData();
    get().setActiveBankroll(newId as number);
  },

  addBet: async (betData) => {
    let profit = 0;
    let payout = 0;

    if (betData.result !== 'PENDING') {
      const settlement = settleBet({
        stake: betData.stake,
        odd: betData.odd,
        result: betData.result,
      });
      profit = settlement.profit;
      payout = settlement.payout;
    }

    await db.bets.add({
      ...betData,
      profit,
      payout,
      createdAt: new Date().toISOString(),
      settledAt: betData.result !== 'PENDING' ? new Date().toISOString() : undefined,
    });

    // Update active bankroll balance if settled
    const activeId = get().activeBankrollId;
    if (activeId && betData.result !== 'PENDING') {
      const bankroll = await db.bankrolls.get(activeId);
      if (bankroll) {
        await db.bankrolls.update(activeId, {
          currentBalance: bankroll.currentBalance + profit,
        });
      }
    }

    await get().loadInitialData();
  },

  settleBetResult: async (betId: number, result: BetResult, cashoutAmount?: number) => {
    const bet = await db.bets.get(betId);
    if (!bet) return;

    const settlement = settleBet({
      stake: bet.stake,
      odd: bet.odd,
      result,
      cashoutAmount,
    });

    await db.bets.update(betId, {
      result,
      profit: settlement.profit,
      payout: settlement.payout,
      settledAt: new Date().toISOString(),
    });

    // Update bankroll balance
    const bankroll = await db.bankrolls.get(bet.bankrollId);
    if (bankroll) {
      await db.bankrolls.update(bet.bankrollId, {
        currentBalance: bankroll.currentBalance + settlement.profit,
      });
    }

    await get().loadInitialData();
  },
}));
