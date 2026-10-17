import type { LoaderFunctionArgs } from "react-router";
import { apiRequest } from "../../lib/rest";
import type { Expense } from "../../types/Expense";

export async function expenseShowLoader({ params }: LoaderFunctionArgs): Promise<Expense> {
  return apiRequest<Expense>(`/api/expenses/${params.id}`);
}