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