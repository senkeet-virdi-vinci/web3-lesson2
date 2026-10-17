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
  categoryId?: number | null;
  category?: Category | null;
  participants?: User[];
}

export interface ExpenseListItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  payer?: { id: number; name: string };
  category?: { id: number; name: string; colour: string } | null;
}

export interface NewExpense {
  date: string;
  description: string;
  amount: number;
  payerId: number;
  categoryId: number;
}

export interface ExpenseFilter {
  amount?: number;
  payerId?: number;
  categoryId?: number;
}

export interface Category {
  id: number;
  name: string;
  colour: string;
}
