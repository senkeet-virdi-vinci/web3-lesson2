import { Link, useLoaderData } from "react-router";
import type { Expense } from "../../types/Expense";

export default function ExpenseShow() {

    const expense = useLoaderData() as Expense;


    return (
        <div>
             <Link to="/expenses">Back to expenses</Link>

            <h1>{expense.description}</h1>
            <p>Amount: {expense.amount.toFixed(2)}</p>
            <p>Date: {new Date(expense.date).toLocaleDateString()}</p>

            <h2>Payer</h2>
            <p>Name: {expense.payer?.name}</p>
            <p>Email: {expense.payer?.email}</p>
            <p>Bank account: {expense.payer?.bankAccount ?? 'Not provided'}</p>

            <h2>Participants</h2>
            {expense.participants && expense.participants.length > 0 ? (
                <ul>
                {expense.participants.map((participant) => (
                    <li key={participant.id}>{participant.name}</li>
                ))}
                </ul>
            ) : (
                <p>No participants</p>
            )}

            <h2>Category</h2>
            {expense.category ? (
                <span
                style={{
                    backgroundColor: expense.category.colour,
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                }}
                >
                {expense.category.name}
                </span>
            ) : (
                <p>None</p>
            )}
        </div>
    );
}