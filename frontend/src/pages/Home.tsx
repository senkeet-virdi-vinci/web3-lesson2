import type { Expense } from "../types/Expense";
import ExpenseItem from "../components/ExpenseItem";
import { useState } from "react";
import ExpenseAdd from "../components/ExpenseAdd";
import useExpenses from "../hooks/useExpenses";
import ExpenseReset from "../components/ExpenseReset";
import ExpenseSorter from "../components/ExpenseSorter";
import ExpenseSearchForm from "../components/ExpenseSearchForm";
import useUsers from "../hooks/useUser";
import useCategories from "../hooks/useCategories";


function Home() {
  const { expenses, error, addExpense, resetExpenses, searchExpenses } = useExpenses();
  const {users} = useUsers();
  const [sortingAlgo, setSortingAlgo] = useState<(a: Expense, b: Expense) => number>(() => () => 1);
  const { categories } = useCategories();

  const handleAlgoChange = (algo: (a: Expense, b: Expense) => number) => {
    setSortingAlgo(() => algo); // We're wrapping algo in a function because useState setter accept either a value or a function returning a value.
  };

  const sortedExpenses = [...expenses].sort(sortingAlgo);

  return <div>
    <h1>Manage your expenses</h1>
    <ExpenseAdd addExpense={addExpense} categories={categories} />
    <ExpenseReset resetExpenses={resetExpenses}/>
    <ExpenseSearchForm users={users} categories={categories} onSearch={searchExpenses} />
    <h2>Your expenses</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {sortedExpenses.length > 0 && <ExpenseSorter setSortingAlgo={handleAlgoChange} />}
    <ul>
      {sortedExpenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseItem expense={expense} />
        </li>
      ))}
    </ul>
  </div>;
}

export default Home;
