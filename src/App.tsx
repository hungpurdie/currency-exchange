import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { CURRENCY, INIT_WALLETS } from '~/constants';
import { SymbolCurrency, UnitCurrency } from '~/models';
import { getRate } from '~/services/api';
import { fixedCurrency } from '~/utils';
import Button from './components/Button';

const Wrapper = styled.div`
  background-color: rgb(31, 41, 55);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  text-align: center;
`;

const Heading = styled.h1`
  font-weight: 600;
  font-size: 1.5rem;
  color: #fff;
`;

const Box = styled.div`
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 6px;
  max-width: 100%;
  width: 350px;
`;

const ActionList = styled.div`
  display: flex;
`;

const Balance = styled.div`
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const WrapWallet = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 150px;
  & span {
    font-weight: 500;
    font-size: 16px;
    margin-right: 10px;
  }
`;

const Input = styled.input`
  width: 100px;
  outline: none;
  border: 1px solid rgba(156, 163, 175);
  border-radius: 4px;
  padding: 10px;
  font-weight: 500;
  font-size: 18px;
`;

const Text = styled.p`
  margin-bottom: 0;
  margin-top: 15px;
  text-align: center;
`;

const TimeRate = styled.div`
  color: #fff;
  margin: 30px 0;
`;

const Error = styled.p`
  color: red;
  margin: 0;
`;

const WrapButtonSubmit = styled.div`
  margin-top: 20px;
  width: 100%;
`;

interface Wallet {
  unit: UnitCurrency;
  balance: number;
  symbol: SymbolCurrency;
}

function App() {
  const [wallets, setWallet] = useState<Record<UnitCurrency, number>>(INIT_WALLETS);
  const [walletFrom, setWalletFrom] = useState<Wallet>();
  const [walletTo, setWalletTo] = useState<Wallet>();
  const [rate, setRate] = useState<number | string>('');
  const [amountFrom, setAmountFrom] = useState<number | string>(0);
  const [amountTo, setAmountTo] = useState<number | string>(0);

  useEffect(() => {
    if (!walletFrom?.unit || !walletTo?.unit) return;

    setRate('---');
    const fetchRate = async () => {
      const rate = await getRate({
        from: walletFrom.unit,
        to: walletTo.unit,
        amount: 1,
      });
      setRate(fixedCurrency(rate));
    };
    if (walletFrom.unit === walletTo.unit) {
      return setRate(1);
    }
    fetchRate();
  }, [walletFrom?.unit, walletTo?.unit]);

  const handleWalletFromClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLElement;
    const unit = button.textContent as UnitCurrency;
    const symbol = CURRENCY.find((c) => c.id === unit)?.symbol;
    if (symbol) {
      setWalletFrom({
        balance: INIT_WALLETS[unit],
        unit: unit,
        symbol,
      });
    }
  };

  const handleWalletToClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLElement;
    const unit = button.textContent as UnitCurrency;
    const symbol = CURRENCY.find((c) => c.id === unit)?.symbol;
    if (symbol) {
      setWalletTo({
        balance: INIT_WALLETS[unit],
        unit: unit,
        symbol,
      });
    }
  };

  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('0') || value.startsWith('-')) {
      value = value && value.replace(/^0+/, '');
      value = value && value.replace(/^-+/, '');
    }
    setAmountFrom(value);

    if (typeof rate === 'number') {
      const amountTo = Number(value) * rate;
      setAmountTo(fixedCurrency(amountTo));
    }
  };

  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('0')) value = value.split('0').join('');
    setAmountTo(value);

    if (typeof rate === 'number') {
      const amountFrom = Number(value) / rate;
      setAmountFrom(fixedCurrency(amountFrom));
    }
  };

  const errorFrom = useMemo(() => {
    if (!walletFrom) return false;
    const balance = wallets[walletFrom.unit];
    if (balance < amountFrom) return 'Exceeds balance';
  }, [wallets, amountFrom, walletFrom]);

  const isAvailableExchange = useMemo(() => {
    return amountFrom && amountTo && walletFrom?.unit !== walletTo?.unit && !errorFrom && rate;
  }, [amountFrom, amountTo, errorFrom, walletFrom, walletTo, rate]);

  const handleExchange = () => {
    if (walletFrom && walletTo) {
      const balanceFrom = walletFrom?.balance - Number(amountFrom);
      const balanceTo = walletTo?.balance + Number(amountTo);
      setWallet({ ...wallets, [walletFrom?.unit]: balanceFrom, [walletTo?.unit]: balanceTo });
      setAmountFrom(0);
      setAmountTo(0);
      setWalletFrom({
        ...walletFrom,
        balance: balanceFrom,
      });
      setWalletTo({
        ...walletTo,
        balance: balanceTo,
      });
    }
  };

  return (
    <Wrapper>
      <Heading>Currency Exchange</Heading>

      <Container>
        <Box>
          <ActionList>
            {CURRENCY.map((cur) => (
              <Button
                key={cur.id}
                onClick={handleWalletFromClick}
                active={walletFrom?.unit === cur.id}
              >
                {cur.title}
              </Button>
            ))}
          </ActionList>
          {walletFrom ? (
            <WrapWallet>
              <Balance>Balance: {walletFrom.symbol.concat(String(walletFrom.balance))}</Balance>
              <div>
                <InputGroup>
                  <span>-</span>
                  <Input value={amountFrom} onChange={handleAmountFromChange} type='number' />
                </InputGroup>
                {errorFrom && <Error>{errorFrom}</Error>}
              </div>
            </WrapWallet>
          ) : (
            <Text>Select your currency to exchange</Text>
          )}
        </Box>
        <TimeRate>
          {walletFrom && walletTo && (
            <span>
              {walletFrom?.symbol}1 = {walletTo?.symbol}
              {rate}
            </span>
          )}
        </TimeRate>
        <Box>
          <ActionList>
            {CURRENCY.map((cur) => (
              <Button key={cur.id} onClick={handleWalletToClick} active={walletTo?.unit === cur.id}>
                {cur.title}
              </Button>
            ))}
          </ActionList>
          {walletTo ? (
            <WrapWallet>
              <Balance>Balance: {walletTo.symbol.concat(String(walletTo.balance))}</Balance>
              <InputGroup>
                <span>+</span>
                <Input value={amountTo} onChange={handleAmountToChange} type='number' />
              </InputGroup>
            </WrapWallet>
          ) : (
            <Text>Select your currency to exchange</Text>
          )}
        </Box>
        <WrapButtonSubmit>
          <Button
            onClick={handleExchange}
            disabled={!isAvailableExchange}
            variant='primary'
            style={{
              padding: '1rem 1.5rem',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            EXCHANGE
          </Button>
        </WrapButtonSubmit>
      </Container>
    </Wrapper>
  );
}

export default App;
