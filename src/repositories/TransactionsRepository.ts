import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((amountValue, transaction) => amountValue + transaction.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((amountValue, transaction) => amountValue + transaction.value, 0);

    const total = income - outcome;
    const balance = { income, outcome, total };
    console.log(balance);

    return balance;
  }
}

export default TransactionsRepository;
