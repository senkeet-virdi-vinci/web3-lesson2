export interface User {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  payerId: number;
  payer?: User;
}

export interface NewExpense {
  date: string;
  description: string;
  amount: number;
  payerId: number;
}

export interface ExpenseFilter {
  amount?: number;
  payerId?: number;
}