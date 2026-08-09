import type { BankrollMovement } from '../../types';

export interface CashflowSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  totalBonuses: number;
  totalAdjustments: number;
  netCashflow: number;
  netInvestedCapital: number;
  movementCount: number;
}

/**
 * Calculates cashflow metrics across bankroll movements
 */
export function calculateCashflowSummary(
  movements: BankrollMovement[],
  bankrollId?: string
): CashflowSummary {
  const filtered = bankrollId
    ? movements.filter((m) => m.bankroll_id === bankrollId)
    : movements;

  const totalDeposits = filtered
    .filter((m) => m.type === 'DEPOSIT')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalWithdrawals = filtered
    .filter((m) => m.type === 'WITHDRAWAL')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalBonuses = filtered
    .filter((m) => m.type === 'BONUS')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalAdjustments = filtered
    .filter((m) => m.type === 'ADJUSTMENT')
    .reduce((acc, m) => acc + m.amount, 0);

  // Net Cashflow = Withdrawals - Deposits (Positive means user has withdrawn more than deposited)
  const netCashflow = totalWithdrawals - totalDeposits;

  // Net Invested Capital = Deposits - Withdrawals (Capital remaining in bookmakers)
  const netInvestedCapital = totalDeposits - totalWithdrawals;

  return {
    totalDeposits,
    totalWithdrawals,
    totalBonuses,
    totalAdjustments,
    netCashflow,
    netInvestedCapital,
    movementCount: filtered.length,
  };
}

/**
 * Computes net balance adjustment from movements for a given bankroll
 */
export function calculateNetMovementsBalance(
  movements: BankrollMovement[],
  bankrollId: string
): number {
  const bankrollMovements = movements.filter((m) => m.bankroll_id === bankrollId);
  return bankrollMovements.reduce((acc, m) => {
    switch (m.type) {
      case 'DEPOSIT':
      case 'BONUS':
      case 'ADJUSTMENT':
        return acc + m.amount;
      case 'WITHDRAWAL':
        return acc - m.amount;
      default:
        return acc;
    }
  }, 0);
}
