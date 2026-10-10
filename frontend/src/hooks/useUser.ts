import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';
const API_BASE_URL = `${host}/api`;

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users (${response.status})`);
      }
      const data = (await response.json()) as User[];
      setUsers(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { users, loading, error, fetchAll };
}

export default useUsers;