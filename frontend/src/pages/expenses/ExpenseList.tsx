import { useLoaderData, useNavigation } from 'react-router';
import ExpenseItem from '../../components/ExpenseItem';
import type { ExpenseListItem } from '../../types/Expense';
import ExpenseSearch from '../../components/ExpenseSearchForm';

export default function ExpenseList() {
  const expenses = useLoaderData() as ExpenseListItem[];
  const navigation = useNavigation();
  const isFiltering = navigation.state === "loading";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Your expenses</h2>

      <ExpenseSearch />

      {isFiltering && <p className="text-sm text-slate-500">Updating…</p>}

      {expenses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
          No expense matches this filter.
        </p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <ExpenseItem expense={expense} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}