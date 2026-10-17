import { useCallback, useEffect, useRef, useState } from 'react';
import type { Expense, NewExpense, ExpenseFilter } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';
const API_BASE_URL = `${host}/api`;

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (newExpense: NewExpense) => Promise<void>;
  resetExpenses: () => Promise<void>;
  searchExpenses: (filter?: ExpenseFilter) => Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterRef = useRef<ExpenseFilter | undefined>(undefined);
  const requestIdRef = useRef(0);

  const fetchExpenses = useCallback(async (filter?: ExpenseFilter) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter?.amount !== undefined) params.set('amount', String(filter.amount));
      if (filter?.payerId !== undefined) params.set('payerId', String(filter.payerId));
      if (filter?.categoryId !== undefined) params.set('categoryId', String(filter.categoryId));
      const query = params.toString();

      const response = await fetch(`${API_BASE_URL}/expenses${query ? `?${query}` : ''}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch expenses (${response.status})`);
      }
      const data = (await response.json()) as Expense[];

      if (requestId !== requestIdRef.current) return;
      setExpenses(data);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(err));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const searchExpenses = useCallback(
    (filter?: ExpenseFilter) => {
      filterRef.current = filter;
      return fetchExpenses(filter);
    },
    [fetchExpenses],
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(
    async (newExpense: NewExpense) => {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) {
          throw new Error(`Failed to add expense (${response.status})`);
        }
        await fetchExpenses(filterRef.current);
      } catch (err) {
        setError(errorMessage(err));
      }
    },
    [fetchExpenses],
  );

  const resetExpenses = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/expenses/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to reset expenses (${response.status})`);
      }
      await fetchExpenses(filterRef.current);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [fetchExpenses]);

  return { expenses, loading, error, addExpense, resetExpenses, searchExpenses };
}

export default useExpenses;