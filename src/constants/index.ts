import { SymbolCurrency, UnitCurrency } from '~/models';

export const INIT_WALLETS: Record<UnitCurrency, number> = {
  USD: 200,
  EUR: 150,
  GBP: 50,
};

export interface Currency {
  id: UnitCurrency;
  title: UnitCurrency;
  symbol: SymbolCurrency;
}

export const CURRENCY: Currency[] = [
  {
    id: 'USD',
    title: 'USD',
    symbol: '$',
  },
  {
    id: 'GBP',
    title: 'GBP',
    symbol: '£',
  },
  {
    id: 'EUR',
    title: 'EUR',
    symbol: '€',
  },
];
