import { useCallback, useEffect, useState } from 'react';
import type { Category } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';
const API_BASE_URL = `${host}/api`;

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

function errorMessage(error: unknown): string {
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
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories (${response.status})`);
      }
      setCategories((await response.json()) as Category[]);
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