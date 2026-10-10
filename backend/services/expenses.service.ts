import { Temporal } from "temporal-polyfill";
import { expenseFromDBO, type Expense, type ExpenseFilter, type NewExpense } from "../types/expense.ts";
import { db } from "../src/prisma/db.ts";

export class ExpensesService {
  
  public static async getExpenses(filter?: ExpenseFilter): Promise<Expense[]> {
    const minAmount = filter?.amount;
    const payerId = filter?.payerId;

    let query = db.orm.public.Expense;

    if (minAmount !== undefined) {
      query = query.where((expense) => expense.amount.gt(minAmount));
    }

    if (payerId !== undefined) {
      query = query.where((expense) => expense.payerId.eq(payerId));
    }

    const expenses = await query.include("payer").all();
    return expenses.map(expenseFromDBO)
  }
  
  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    const user = await db.orm.public.User.first({ id: newExpense.payerId });

    if (!user) {
      throw new Error(`User "${newExpense.payer}" not found`);
    }

    const createdExpense = await db.orm.public.Expense.create({
      description: newExpense.description,
      amount: newExpense.amount,
      date: Temporal.Instant.fromEpochMilliseconds(newExpense.date.getTime()),
      payer: (payer) =>
        payer.connect({
          id: user.id,
        })
    });

    return expenseFromDBO({ ...createdExpense, payer: user });
  }
  
  public static async resetExpenses(): Promise<Expense[]> {
    const rows = await db.orm.public.Expense.all();

    for (const row of rows) {
      await db.orm.public.Expense.where({ id: row.id }).delete();
    }

    return this.getExpenses();
  }
}