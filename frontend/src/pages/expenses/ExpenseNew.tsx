import { useNavigate } from 'react-router';
import ExpenseAdd from '../../components/ExpenseAdd';
import type { NewExpense as NewExpenseInput } from '../../types/Expense';
import useCategories from '../../hooks/useCategories';

export default function ExpenseNew() {
    const navigate = useNavigate();
    const {categories} = useCategories();  // ajouté par moi pour la compilation 

  const createExpense = async (expense: NewExpenseInput) => {
    // STUB — we are not talking to the backend yet. Exercise 6 replaces this
    // console.log with a GraphQL mutation. For now we are only checking that
    // the form validates and that the navigation happens.
    console.log('Expense to create (not sent to the backend yet):', expense);

    navigate('/expenses');
  };

  return <ExpenseAdd addExpense={createExpense} categories={categories} />;

}