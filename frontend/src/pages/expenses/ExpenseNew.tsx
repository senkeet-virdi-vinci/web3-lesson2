import { useNavigate } from 'react-router';
import ExpenseAdd from '../../components/ExpenseAdd';
import type { NewExpense as NewExpenseInput } from '../../types/Expense';
import useCategories from '../../hooks/useCategories';
import { graphqlRequest } from '../../lib/graphql';

const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;

export default function ExpenseNew() {
    const navigate = useNavigate();
    const {categories} = useCategories();  // ajouté par moi pour la compilation 

  const createExpense = async (expense: NewExpenseInput) => {
    await graphqlRequest(CREATE_EXPENSE, { input: expense });
    navigate('/expenses');
  };

  return <ExpenseAdd addExpense={createExpense} categories={categories} />;

}