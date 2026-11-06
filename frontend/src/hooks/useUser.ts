import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/rest';
import type { User } from '../types/User';


function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<User[]>('/api/users')
      .then(setUsers)
      .catch((error)=> console.error("Error getting users:", error))
      .finally(() => setLoading(false))
  }, []);

  return { users, loading };
}

export default useUsers;