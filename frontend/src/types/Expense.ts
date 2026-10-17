import { z } from "zod";

export interface User {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
}

export interface Category {
  id: number;
  name: string;
  colour: string;
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
  payer?: { id?: number; name: string };
  category?: { id?: number; name: string; colour: string } | null;
}

export interface ExpenseFilter {
  amount?: number;
  payerId?: number;
  categoryId?: number;
}

export const ExpenseFormSchema = z.object({
  description: z.string().min(1, "Description is required").max(200, "Description cannot exceed 200 characters"),
  payerId: z.number({ message: "Payer is required" }).int().positive("Payer is required"),
  amount: z.number({ message: "Amount is required" }).positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  participantsRaw: z.string(),
  categoryId: z.number().int().optional(),
});

export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

export interface NewExpense {
  description: string;
  amount: number;
  date: string;
  payerId: number;
  participants: number[];
  categoryId?: number;
}