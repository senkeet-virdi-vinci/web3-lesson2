import { useCallback, useEffect, useState } from 'react';
import type { Category } from '../types/Expense';
import { apiRequest } from '../lib/rest';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof Response) return `Request failed (${error.status})`;
  return error instanceof Error ? error.message : 'Unknown error';
}

function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCategories(await apiRequest<Category[]>('/api/categories'));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { categories, loading, error, fetchAll };
}

export default useCategories;