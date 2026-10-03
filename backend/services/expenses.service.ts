import { Temporal } from "temporal-polyfill";
import type { Expense, NewExpense } from "../types/expense.ts";
import { db } from "../src/prisma/db.ts";

export class ExpensesService {
  
  public static async getExpenses(): Promise<Expense[]> {
    const expenses = await db.orm.public.Expense
    .include("payer")
    .all();

    return expenses.map((expense) => ({
      id: expense.id,
      date: expense.date.toString(),
      description: expense.description,
      amount: expense.amount,
      payer: expense.payer.name,
    }));
  }
  
  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    const user = await db.orm.public.User.first({
      name: newExpense.payer,
    });

    if (!user) {
      throw new Error(`User "${newExpense.payer}" not found`);
    }

    const createdExpense = await db.orm.public.Expense.create({
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date
        ? Temporal.Instant.from(`${newExpense.date}T00:00:00Z`)
        : Temporal.Now.instant(),
      payer: (payer) =>
        payer.connect({
          id: user.id,
        })
    });

    return {
      id: createdExpense.id,
      date: createdExpense.date.toString(),
      description: createdExpense.description,
      amount: createdExpense.amount,
      payer: user.name,
    };
  }
  
  public static async resetExpenses(): Promise<Expense[]> {
    const expenses = await this.getExpenses();

    for (const expense of expenses) {
      await db.orm.public.Expense.where({ id: expense.id }).delete();
    }

    return this.getExpenses();
  }
}