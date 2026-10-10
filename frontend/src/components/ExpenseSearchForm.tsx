import { useState } from 'react';
import type { ExpenseFilter, User } from '../types/Expense';

interface ExpenseSearchFormProps {
  users: User[];
  onSearch: (filter: ExpenseFilter) => void;
}

function ExpenseSearchForm({ users, onSearch }: ExpenseSearchFormProps) {
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      amount: amount === '' ? undefined : Number(amount),
      payerId: payerId === '' ? undefined : Number(payerId),
    });
  };

  return (
    <div>
      <h2>Search expenses</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="search-amount">Amount greater than:</label>
          <input
            id="search-amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label htmlFor="search-payer">Payer:</label>
          <select
            id="search-payer"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
          >
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default ExpenseSearchForm;