import type { LoaderFunctionArgs } from "react-router";
import type { Expense } from "../../types/Expense";
import { apiRequest } from "../../lib/rest";

export async function expenseListLoader({ request }: LoaderFunctionArgs): Promise<Expense[]> {
  const query = new URL(request.url).searchParams.toString();

  return apiRequest<Expense[]>(`/api/expenses${query ? `?${query}` : ''}`);
}