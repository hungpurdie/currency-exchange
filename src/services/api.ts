import { UnitCurrency } from '~/models';

const API_URL = 'https://api.apilayer.com/exchangerates_data';

interface RateParams {
  to: UnitCurrency;
  from: UnitCurrency;
  amount: number;
}

export const getRate = async ({ to, from, amount }: RateParams): Promise<any> => {
  const response = await fetch(`${API_URL}/convert?to=${to}&from=${from}&amount=${amount}`, {
    redirect: 'follow',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: 'nUDdTCf08ipysOMInjPLPNq8L1aeMrIn',
    },
  });
  return response
    .json()
    .then((data) => data.info.rate)
    .catch(() => {
      return new Promise((resolve) => {
        return resolve(0.0987);
      });
    });
};
