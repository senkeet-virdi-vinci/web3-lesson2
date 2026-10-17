import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types/Expense';
import { apiRequest } from '../lib/rest';


interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof Response) return `Request failed (${error.status})`;
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
      setUsers(await apiRequest<User[]>('/api/users'));
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