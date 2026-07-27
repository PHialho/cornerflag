import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { settleBet, type BetResult } from '../lib/math/calculator';
import type { Bankroll, Bet } from '../types';

export const DEFAULT_SPORTS = [
  'Futebol',
  'Basquetebol',
  'Ténis',
  'Esports',
  'Futsal',
  'Voleibol',
];

export const DEFAULT_STRATEGIES = [
  'Over/Under Gols',
  'Cantos (Corners)',
  'Match Odds (1X2)',
  'Lay ao Empate',
  'Handicap Asiático',
  'Ambas Marcam (BTTS)',
  'Precificação +EV',
];

interface CornerFlagState {
  bankrolls: Bankroll[];
  activeBankrollId: string | null;
  bets: Bet[];
  sports: string[];
  strategies: string[];
  isLoading: boolean;

  // Actions
  loadInitialData: () => Promise<void>;
  setActiveBankroll: (id: string) => void;
  createBankroll: (
    name: string,
    initialBalance: number,
    currency?: string,
    targetUnitPercent?: number,
    description?: string
  ) => Promise<void>;
  updateBankroll: (id: string, updates: Partial<Bankroll>) => Promise<void>;
  deleteBankroll: (id: string) => Promise<void>;
  addBet: (betData: Omit<Bet, 'id' | 'created_at' | 'profit' | 'payout'>) => Promise<void>;
  settleBetResult: (betId: string, result: BetResult, cashoutAmount?: number) => Promise<void>;
  deleteBet: (betId: string) => Promise<void>;
  addSport: (sportName: string) => void;
  addStrategy: (strategyName: string) => void;
}

const DEFAULT_BANKROLL: Bankroll = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Banca Principal',
  currency: 'EUR',
  initial_balance: 1000,
  current_balance: 1000,
  is_default: true,
  created_at: new Date().toISOString(),
};

function recalculateBankrollBalances(bankrolls: Bankroll[], bets: Bet[]): Bankroll[] {
  return bankrolls.map((b) => {
    const bankrollBets = bets.filter((bet) => bet.bankroll_id === b.id);
    const totalProfit = bankrollBets.reduce((acc, bet) => {
      return acc + (bet.result !== 'PENDING' ? bet.profit : 0);
    }, 0);

    return {
      ...b,
      current_balance: settleBetRound(b.initial_balance + totalProfit, 2),
    };
  });
}

function settleBetRound(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export const useCornerFlagStore = create<CornerFlagState>((set, get) => ({
  bankrolls: [DEFAULT_BANKROLL],
  activeBankrollId: DEFAULT_BANKROLL.id,
  bets: [],
  sports: DEFAULT_SPORTS,
  strategies: DEFAULT_STRATEGIES,
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
          const { data: remoteBets, error: betsError } = await supabase
            .from('bets')
            .select('*')
            .eq('bankroll_id', activeId)
            .order('created_at', { ascending: false });

          const loadedBets = (!betsError && remoteBets) ? remoteBets : get().bets;
          const updatedBankrolls = recalculateBankrollBalances(remoteBankrolls, loadedBets);

          set({
            bankrolls: updatedBankrolls,
            activeBankrollId: activeId,
            bets: loadedBets,
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
        const { data: remoteBets, error } = await supabase
          .from('bets')
          .select('*')
          .eq('bankroll_id', id)
          .order('created_at', { ascending: false });

        if (!error && remoteBets && remoteBets.length > 0) {
          set((state) => {
            const otherBankrollBets = state.bets.filter((b) => b.bankroll_id !== id);
            const allBets = [...remoteBets, ...otherBankrollBets];
            return {
              bets: allBets,
              bankrolls: recalculateBankrollBalances(state.bankrolls, allBets),
              isLoading: false,
            };
          });
          return;
        }
      } catch {
        // Fallback
      }
    }

    set({ isLoading: false });
  },

  createBankroll: async (
    name: string,
    initialBalance: number,
    currency: string = 'EUR',
    targetUnitPercent: number = 1,
    description: string = ''
  ) => {
    const newBankroll: Bankroll = {
      id: crypto.randomUUID(),
      name,
      currency,
      initial_balance: initialBalance,
      current_balance: initialBalance,
      target_unit_percent: targetUnitPercent,
      description: description || undefined,
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
          target_unit_percent: newBankroll.target_unit_percent,
          description: newBankroll.description,
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

  updateBankroll: async (id: string, updates: Partial<Bankroll>) => {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('bankrolls')
          .update(updates)
          .eq('id', id);
      } catch {
        // Fallback
      }
    }

    set((state) => {
      const updatedBankrolls = state.bankrolls.map((b) => (b.id === id ? { ...b, ...updates } : b));
      return {
        bankrolls: recalculateBankrollBalances(updatedBankrolls, state.bets),
      };
    });
  },

  deleteBankroll: async (id: string) => {
    const state = get();
    if (state.bankrolls.length <= 1) {
      return; // Prevenir remoção da última banca restante
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bankrolls').delete().eq('id', id);
      } catch {
        // Fallback
      }
    }

    set((prevState) => {
      const filtered = prevState.bankrolls.filter((b) => b.id !== id);
      const newActiveId = prevState.activeBankrollId === id ? filtered[0].id : prevState.activeBankrollId;
      return {
        bankrolls: filtered,
        activeBankrollId: newActiveId,
      };
    });
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
      id: crypto.randomUUID(),
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
      return {
        bets: updatedBets,
        bankrolls: recalculateBankrollBalances(state.bankrolls, updatedBets),
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

      return {
        bets: updatedBets,
        bankrolls: recalculateBankrollBalances(state.bankrolls, updatedBets),
      };
    });
  },

  deleteBet: async (betId: string) => {
    const bet = get().bets.find((b) => b.id === betId);
    if (!bet) return;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bets').delete().eq('id', betId);
      } catch {
        // Fallback
      }
    }

    set((state) => {
      const updatedBets = state.bets.filter((b) => b.id !== betId);
      return {
        bets: updatedBets,
        bankrolls: recalculateBankrollBalances(state.bankrolls, updatedBets),
      };
    });
  },

  addSport: (sportName: string) => {
    const trimmed = sportName.trim();
    if (!trimmed) return;
    set((state) => {
      if (state.sports.includes(trimmed)) return state;
      return { sports: [...state.sports, trimmed] };
    });
  },

  addStrategy: (strategyName: string) => {
    const trimmed = strategyName.trim();
    if (!trimmed) return;
    set((state) => {
      if (state.strategies.includes(trimmed)) return state;
      return { strategies: [...state.strategies, trimmed] };
    });
  },
}));
