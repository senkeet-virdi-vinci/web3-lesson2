/**
 * A simple component to display an expense item
 */

import { Link } from "react-router";
import type { ExpenseListItem } from "../types/Expense";

interface ExpenseItemProps {
  expense: ExpenseListItem;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300">
      <div>
        <Link
          to={`/expenses/${expense.id}`}
          className="font-medium text-indigo-600 hover:underline"
        >
          {expense.description}
        </Link>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(expense.date).toLocaleDateString()} · paid by {expense.payer.name}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {expense.category && (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: expense.category.colour }}
          >
            {expense.category.name}
          </span>
        )}
        <span className="font-semibold tabular-nums text-slate-900">
          {expense.amount.toFixed(2)} €
        </span>
      </div>
    </div>
  );
}

export default ExpenseItem;