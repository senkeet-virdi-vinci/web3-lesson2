import { Temporal } from "temporal-polyfill";
import { expenseFromDBO, type Expense, type ExpenseFilter, type NewExpense } from "../types/expense.ts";
import { db } from "../src/prisma/db.ts";

export class ExpensesService {
  
  public static async getExpenses(filter?: ExpenseFilter): Promise<Expense[]> {
    const minAmount = filter?.amount;
    const payerId = filter?.payerId;
    const categoryId = filter?.categoryId;

    let query = db.orm.public.Expense;

    if (minAmount !== undefined) {
      query = query.where((expense) => expense.amount.gt(minAmount));
    }

    if (payerId !== undefined) {
      query = query.where((expense) => expense.payerId.eq(payerId));
    }

    if (categoryId !== undefined) {
      query = query.where((expense) => expense.categoryId.eq(categoryId));
    }

    const expenses = await query.include("payer").include("category").all();
    return expenses.map(expenseFromDBO)
  }

  public static async getExpenseById(id: number): Promise<Expense | undefined> {
    const row = await db.orm.public.Expense
    .where((expense) => expense.id.eq(id))
    .include("payer")
    .include("category")
    .include("participants")
    .first();

    return row ? expenseFromDBO(row) : undefined;
  }
    
  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    const user = await db.orm.public.User.first({ id: newExpense.payerId });
    if (!user) {
      throw new Error(`User with id ${newExpense.payerId} not found`);
    }

    let category = null;
    if (newExpense.categoryId != null) {
      category = await db.orm.public.Category.first({ id: newExpense.categoryId });
      if (!category) {
        throw new Error(`Category with id ${newExpense.categoryId} not found`);
      }
    }

    const created = await db.orm.public.Expense.create({
      description: newExpense.description,
      amount: newExpense.amount,
      date: Temporal.Instant.fromEpochMilliseconds(newExpense.date.getTime()),
      payer: (payer) => payer.connect({ id: user.id }),
      ...(category
        ? { category: (c: any) => c.connect({ id: category.id }) }
        : {}),
    });

    for (const userId of newExpense.participants) {
      await db.orm.public.ExpenseUser.create({
        expenseId: created.id,
        userId,
        expense: (expense) => expense.connect({ id: created.id }),
        user: (u) => u.connect({ id: userId }),
      });
  }

  // On relit la dépense complète (payeur, catégorie, participants)
  return (await this.getExpenseById(created.id))!;
}
  
  public static async resetExpenses(): Promise<Expense[]> {
    const rows = await db.orm.public.Expense.all();

    for (const row of rows) {
      await db.orm.public.Expense.where({ id: row.id }).delete();
    }

    return this.getExpenses();
  }
}