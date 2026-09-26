export interface Expense {
  id: number;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export type NewExpense = Omit<Expense, 'id'>;
