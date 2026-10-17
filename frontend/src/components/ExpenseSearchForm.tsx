import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import type { Category, User } from '../types/Expense';

interface SearchFormValues {
  amount?: number;
  payerId?: string;
  categoryId?: string;
}

interface ExpenseSearchProps {
  users: User[];
  categories: Category[];
}

function ExpenseSearch({ users, categories }: ExpenseSearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: {
      amount: searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined,
      payerId: searchParams.get('payerId') ?? '',
      categoryId: searchParams.get('categoryId') ?? '',
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    const filter: Record<string, string> = {};
    if (data.amount) filter.amount = String(data.amount);
    if (data.payerId) filter.payerId = data.payerId;
    if (data.categoryId) filter.categoryId = data.categoryId;

    setSearchParams(filter);
  };

  return (
    <div>
      <h2>Search expenses</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="search-amount">Amount greater than:</label>
          <input
            id="search-amount"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount"
            {...register('amount', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="search-payer">Payer:</label>
          <select id="search-payer" {...register('payerId')}>
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-category">Category:</label>
          <select id="search-category" {...register('categoryId')}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default ExpenseSearch;