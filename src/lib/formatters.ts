import type { OddsFormat, Currency } from '../store/useSettingsStore';

export interface FormattingOptions {
  decimals?: number;
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

/**
 * Formats a number with custom decimal and thousands separators
 */
export function formatNumber(
  val: number,
  options: FormattingOptions = {}
): string {
  if (isNaN(val) || val === null || val === undefined) return '0';

  const decimals = options.decimals ?? 2;
  const decimalSep = options.decimalSeparator ?? ',';
  const thousandsSep = options.thousandsSeparator ?? '.';

  const fixed = Math.abs(val).toFixed(decimals);
  const parts = fixed.split('.');
  
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add thousand separators to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  const prefix = val < 0 ? '-' : '';
  const resultDecimal = decimals > 0 ? `${decimalSep}${decimalPart}` : '';

  return `${prefix}${integerPart}${resultDecimal}`;
}

/**
 * Formats monetary amounts with currency symbol and user separators
 */
export function formatCurrency(
  val: number,
  currency: Currency = 'EUR',
  options: FormattingOptions = {}
): string {
  const formattedVal = formatNumber(val, { decimals: 2, ...options });

  switch (currency) {
    case 'USD':
      return `$ ${formattedVal}`;
    case 'GBP':
      return `£ ${formattedVal}`;
    case 'BRL':
      return `R$ ${formattedVal}`;
    case 'EUR':
    default:
      return `${formattedVal} €`;
  }
}

/**
 * Converts decimal odds (e.g. 2.50) into Decimal, Fractional, or American odds format
 */
export function formatOdds(decimalOdd: number, format: OddsFormat = 'decimal'): string {
  if (isNaN(decimalOdd) || decimalOdd <= 1) return '1.00';

  if (format === 'fractional') {
    return decimalToFractional(decimalOdd);
  }

  if (format === 'american') {
    return decimalToAmerican(decimalOdd);
  }

  return decimalOdd.toFixed(2);
}

function decimalToAmerican(decimalOdd: number): string {
  if (decimalOdd >= 2.0) {
    const american = Math.round((decimalOdd - 1) * 100);
    return `+${american}`;
  } else {
    const american = Math.round(-100 / (decimalOdd - 1));
    return `${american}`;
  }
}

function decimalToFractional(decimalOdd: number): string {
  const value = decimalOdd - 1;
  const tolerance = 1e-4;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = value;
  
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    
    b = 1 / (b - a);
  } while (Math.abs(value - h1 / k1) > value * tolerance && k1 < 100);

  return `${h1}/${k1}`;
}
