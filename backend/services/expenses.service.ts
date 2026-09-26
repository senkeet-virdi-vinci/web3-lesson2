import type { Expense, NewExpense } from "../types/expense.ts";
import { db } from "../src/prisma/db.ts";

export class ExpensesService {

  private static dataPath = "./data/expenses.json";
  private static resetPath = "./data/expenses.init.json";
  
  public static async getExpenses(): Promise<Expense[]> {
    const expenses = await db.orm.public.Expense.all();
    return expenses;
  }
  
  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    const createdExpense = await db.orm.public.Expense.create({
      description: newExpense.description,
      amount: newExpense.amount,
      payer: newExpense.payer,
      date: newExpense.date ? new Date(newExpense.date).toISOString() : new Date().toISOString()
    });

    return createdExpense;
  }
  
    public static async resetExpenses(): Promise<Expense[]> {
    const expenses = await this.getExpenses();

    for (const expense of expenses) {
      await db.orm.public.Expense.where({ id: expense.id }).delete();
    }

    return this.getExpenses();
  }
}