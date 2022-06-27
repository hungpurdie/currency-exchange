import { UnitCurrency } from '~/models/Currency';

export const formatCurrencyUnit = (value: number, currency: UnitCurrency) => {
  let unitFormatter;
  if (currency === 'USD') {
    unitFormatter = 'en-US';
  } else if (currency === 'EUR') {
    unitFormatter = 'de-DE';
  }

  return new Intl.NumberFormat(unitFormatter, {
    style: 'currency',
    currency,
    maximumFractionDigits: 3,
  }).format(value);
};

export const fixedCurrency = (value: number | string) => {
  return parseFloat(Number(value).toFixed(3));
};
