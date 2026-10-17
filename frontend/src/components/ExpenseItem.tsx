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
    <div>

    <Link to={`/expenses/${expense.id}`}>{expense.description}</Link>

      <p>Amount: {expense.amount.toFixed(2)}</p>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
      <p>Payer Name: {expense.payer?.name}</p>
      <p>
      Category:{' '}
      {expense.category ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: expense.category.colour,
              marginRight: '6px',
            }}
          />
          {expense.category.name}
        </>
      ) : (
        'None'
      )}
    </p>

      
    </div>
  )
  
}

export default ExpenseItem;