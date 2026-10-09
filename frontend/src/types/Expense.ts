export interface User {
  id: number;
  name: string;
  email: string;
  bankAccount: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  payer: User;
  amount: number;
}

export type NewExpense = Omit<Expense, 'id'>
