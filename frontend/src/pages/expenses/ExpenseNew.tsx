import { useNavigate } from 'react-router';
import ExpenseAdd, { type NewExpenseFormOutput } from '../../components/ExpenseAdd';
import { graphqlRequest } from '../../lib/graphql';
import { useAuth } from '../../contexts/AuthContext';


const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;

export default function ExpenseNew() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createExpense = async (expense: NewExpenseFormOutput) => {
  // We still send a payerId, because the mutation takes one. But sending it no
  // longer *decides* anything: the resolver compares it against the id in the
  // token and refuses the request if they differ. Try putting another user's id
  // here and watch the server say no.
  await graphqlRequest(CREATE_EXPENSE, {
    input: { ...expense, payerId: user!.id },
  });
  navigate('/expenses');
};

  return <ExpenseAdd expenseAdd={createExpense} />;
}