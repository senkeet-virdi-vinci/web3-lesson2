import { z } from "zod";
import { userSchema } from "./user.ts";
import { categorySchema } from "./category.ts";

export const expenseSchema = z.object({
  id: z.string(),
  date: z.iso.datetime({ offset: true }).pipe(z.coerce.date()),
  description: z.string().max(200),
  payerId: z.number(),
  payer: userSchema.optional(),
  amount: z.number().nonnegative(),
  categoryId: z.number().nullable().optional(),
  category: categorySchema.nullable().optional(),
});

export const newExpenseSchema = expenseSchema
  .omit({ id: true, category: true })
  .extend({ categoryId: z.number() });

const expenseFilterSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
  payerId: z.coerce.number().int().nonnegative().optional(),
});

function parseWithSchema<T>(schema: z.ZodType<T>, data: unknown): T | false {
  const result = schema.safeParse(data);
  return result.success ? result.data : false;
}


export type Expense = z.infer<typeof expenseSchema>;
export type NewExpense = z.infer<typeof newExpenseSchema>;
export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;


export function parseExpenseFilter(data: unknown): ExpenseFilter | false {
  return parseWithSchema(expenseFilterSchema, data);
}

export function parseNewExpense(data: unknown): NewExpense | false {
  return parseWithSchema(newExpenseSchema, data);
}

export function expenseFromDBO(dbo: any): Expense {
  return {
      ...dbo,
      id: dbo.id.toString(),
      date: new Date(dbo.date.toString()),
  };
}