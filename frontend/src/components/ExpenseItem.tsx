/**
 * A simple component to display an expense item
 */

import { Link } from "react-router";
import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div>

    <Link to={`/expenses/${expense.id}`}>{expense.description}</Link>

    </div>
  )
  
}

export default ExpenseItem;