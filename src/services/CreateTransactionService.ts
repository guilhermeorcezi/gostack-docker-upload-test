import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const transactionsRepository = getCustomRepository(
        TransactionsRepository,
      );
      const balance = await transactionsRepository.getBalance();

      if (value > Number(balance.total))
        throw new AppError('Insufficient funds', 400);
    }

    const hasCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    console.log(hasCategory);
    let newCategory = { id: '' };

    if (!hasCategory) {
      newCategory = await categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
    }

    const transaction = await transactionRepository.create({
      title,
      type,
      value,
      category_id: hasCategory ? hasCategory.id : newCategory.id,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
