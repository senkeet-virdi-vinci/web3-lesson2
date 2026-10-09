import { useState } from 'react';

interface ExpenseSearchFormProps {
  onSearch: (amount?: number) => void;
}

function ExpenseSearchForm({ onSearch }: ExpenseSearchFormProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(amount === '' ? undefined : Number(amount));
  };

  return (
    <div>
      <h2>Search expenses</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default ExpenseSearchForm;