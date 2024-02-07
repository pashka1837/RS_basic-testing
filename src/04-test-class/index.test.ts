import lodash from 'lodash';

import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  BankAccount,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  let myAcc = getBankAccount(200);
  const somebodyAcc = getBankAccount(200);

  beforeEach(() => {
    myAcc = getBankAccount(200);
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const initAmount = 200;
    expect(getBankAccount(initAmount).getBalance()).toEqual(initAmount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const moreThenBalance = myAcc.getBalance() + 200;

    expect(() => myAcc.withdraw(moreThenBalance)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const moreThenBalance = myAcc.getBalance() + 200;

    expect(() => myAcc.transfer(moreThenBalance, somebodyAcc)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const lessThenBalance = myAcc.getBalance() - 100;

    expect(() => myAcc.transfer(lessThenBalance, myAcc)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const prevBalance = myAcc.getBalance();
    const moneyToDeposit = 200;
    const curBalance = prevBalance + moneyToDeposit;
    expect(myAcc.deposit(moneyToDeposit).getBalance()).toEqual(curBalance);
  });

  test('should withdraw money', () => {
    const prevBalance = myAcc.getBalance();
    const moneyToWithdraw = 100;
    const curBalance = prevBalance - moneyToWithdraw;
    expect(myAcc.withdraw(moneyToWithdraw).getBalance()).toEqual(curBalance);
  });

  test('should transfer money', () => {
    const myPrevBalance = myAcc.getBalance();
    const myMoneyToTransfer = 100;
    const myCurBalance = myPrevBalance - myMoneyToTransfer;

    const personPrevBalance = somebodyAcc.getBalance();
    const personCurBalance = personPrevBalance + myMoneyToTransfer;
    expect(myAcc.transfer(myMoneyToTransfer, somebodyAcc).getBalance()).toEqual(
      myCurBalance,
    );
    expect(somebodyAcc.getBalance()).toEqual(personCurBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    lodash.random = jest.fn(() => 1);
    const result = await myAcc.fetchBalance();
    expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const returnBalance = 222;
    BankAccount.prototype.fetchBalance = jest.fn(async () => returnBalance);
    await myAcc.synchronizeBalance();
    expect(myAcc.getBalance()).toEqual(returnBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    BankAccount.prototype.fetchBalance = jest.fn(async () => null);
    await expect(myAcc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
