import { useLoaderData, useSearchParams } from 'react-router';
import ExpenseItem from '../../components/ExpenseItem';
import useCategories from '../../hooks/useCategories';
import useUsers from '../../hooks/useUser';
import type { Expense } from '../../types/Expense';
import ExpenseSearch from '../../components/ExpenseSearchForm';

export default function ExpenseList() {
  const expenses = useLoaderData() as Expense[];
  const [searchParams] = useSearchParams();
  const { users } = useUsers();
  const { categories } = useCategories();

  return (
    <div>
      {users.length > 0 && categories.length > 0 && (
        <ExpenseSearch
          key={searchParams.toString()}
          users={users}
          categories={categories}
        />
      )}

      <h2>Your expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem expense={expense} />
          </li>
        ))}
      </ul>
    </div>
  );
}