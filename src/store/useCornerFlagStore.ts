import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { settleBet, type BetResult } from '../lib/math/calculator';
import type { Bankroll, Bet } from '../types';

interface CornerFlagState {
  bankrolls: Bankroll[];
  activeBankrollId: string | null;
  bets: Bet[];
  isLoading: boolean;
  
  // Actions
  loadInitialData: () => Promise<void>;
  setActiveBankroll: (id: string) => void;
  createBankroll: (name: string, initialBalance: number, currency?: string) => Promise<void>;
  addBet: (betData: Omit<Bet, 'id' | 'created_at' | 'profit' | 'payout'>) => Promise<void>;
  settleBetResult: (betId: string, result: BetResult, cashoutAmount?: number) => Promise<void>;
}

const DEFAULT_BANKROLL: Bankroll = {
  id: 'default-bankroll-1',
  name: 'Banca Principal',
  currency: 'EUR',
  initial_balance: 1000,
  current_balance: 1000,
  is_default: true,
  created_at: new Date().toISOString(),
};

export const useCornerFlagStore = create<CornerFlagState>((set, get) => ({
  bankrolls: [DEFAULT_BANKROLL],
  activeBankrollId: DEFAULT_BANKROLL.id,
  bets: [],
  isLoading: false,

  loadInitialData: async () => {
    set({ isLoading: true });

    if (isSupabaseConfigured) {
      try {
        const { data: remoteBankrolls, error: bankrollError } = await supabase
          .from('bankrolls')
          .select('*')
          .order('created_at', { ascending: true });

        if (!bankrollError && remoteBankrolls && remoteBankrolls.length > 0) {
          const activeId = get().activeBankrollId || remoteBankrolls[0].id;
          const { data: remoteBets } = await supabase
            .from('bets')
            .select('*')
            .eq('bankroll_id', activeId)
            .order('created_at', { ascending: false });

          set({
            bankrolls: remoteBankrolls,
            activeBankrollId: activeId,
            bets: remoteBets || [],
            isLoading: false,
          });
          return;
        }
      } catch {
        // Fallback gracefully
      }
    }

    set({ isLoading: false });
  },

  setActiveBankroll: async (id: string) => {
    set({ activeBankrollId: id, isLoading: true });

    if (isSupabaseConfigured) {
      try {
        const { data: remoteBets } = await supabase
          .from('bets')
          .select('*')
          .eq('bankroll_id', id)
          .order('created_at', { ascending: false });

        set({ bets: remoteBets || [], isLoading: false });
        return;
      } catch {
        // Fallback
      }
    }

    set({ isLoading: false });
  },

  createBankroll: async (name: string, initialBalance: number, currency: string = 'EUR') => {
    const newBankroll: Bankroll = {
      id: isSupabaseConfigured ? crypto.randomUUID() : `bankroll-${Date.now()}`,
      name,
      currency,
      initial_balance: initialBalance,
      current_balance: initialBalance,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bankrolls').insert([{
          id: newBankroll.id,
          name: newBankroll.name,
          currency: newBankroll.currency,
          initial_balance: newBankroll.initial_balance,
          current_balance: newBankroll.current_balance,
        }]);
      } catch {
        // Fallback
      }
    }

    set((state) => ({
      bankrolls: [...state.bankrolls, newBankroll],
      activeBankrollId: newBankroll.id,
    }));
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

    const newBet: Bet = {
      ...betData,
      id: isSupabaseConfigured ? crypto.randomUUID() : `bet-${Date.now()}`,
      profit,
      payout,
      created_at: new Date().toISOString(),
      settled_at: betData.result !== 'PENDING' ? new Date().toISOString() : undefined,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bets').insert([{
          id: newBet.id,
          bankroll_id: newBet.bankroll_id,
          match: newBet.match,
          league: newBet.league,
          market: newBet.market,
          selection: newBet.selection,
          odd: newBet.odd,
          closing_odd: newBet.closing_odd,
          stake: newBet.stake,
          estimated_probability: newBet.estimated_probability,
          result: newBet.result,
          profit: newBet.profit,
          payout: newBet.payout,
        }]);
      } catch {
        // Fallback
      }
    }

    set((state) => {
      const updatedBets = [newBet, ...state.bets];
      const updatedBankrolls = state.bankrolls.map((b) => {
        if (b.id === betData.bankroll_id && betData.result !== 'PENDING') {
          return {
            ...b,
            current_balance: b.current_balance + profit,
          };
        }
        return b;
      });

      return {
        bets: updatedBets,
        bankrolls: updatedBankrolls,
      };
    });
  },

  settleBetResult: async (betId: string, result: BetResult, cashoutAmount?: number) => {
    const bet = get().bets.find((b) => b.id === betId);
    if (!bet) return;

    const settlement = settleBet({
      stake: bet.stake,
      odd: bet.odd,
      result,
      cashoutAmount,
    });

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('bets')
          .update({
            result,
            profit: settlement.profit,
            payout: settlement.payout,
            settled_at: new Date().toISOString(),
          })
          .eq('id', betId);
      } catch {
        // Fallback
      }
    }

    set((state) => {
      const updatedBets = state.bets.map((b) => {
        if (b.id === betId) {
          return {
            ...b,
            result,
            profit: settlement.profit,
            payout: settlement.payout,
            settled_at: new Date().toISOString(),
          };
        }
        return b;
      });

      const updatedBankrolls = state.bankrolls.map((b) => {
        if (b.id === bet.bankroll_id) {
          return {
            ...b,
            current_balance: b.current_balance + settlement.profit,
          };
        }
        return b;
      });

      return {
        bets: updatedBets,
        bankrolls: updatedBankrolls,
      };
    });
  },
}));
