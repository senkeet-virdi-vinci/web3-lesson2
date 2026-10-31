import { createSchema } from 'graphql-yoga';
import { UsersService } from '../../services/users.service.ts';
import { CategoriesService } from '../../services/categories.service.ts';
import { ExpensesService } from '../../services/expenses.service.ts';
import { parseNewExpense, type Expense } from '../../types/expense.ts';
import { GraphQLError } from 'graphql/error';
import type { GraphQLContext } from '../../types/GraphQLContext.ts';
import { requireAuth } from './authHelper.ts';
import { AuthorizationError, NotFoundError } from '../errors/app.error.ts';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
  type User {
    id: Int!
    name: String!
    email: String!
    bankAccount: String
    expenses(filter: ExpenseFilter): [Expense!]!
  }

  type Category {
    id: Int!
    name: String!
    colour: String!
  }

  type Expense {
    id: Int!
    description: String!
    amount: Float!
    date: String!
    payer: User!
    participants: [User!]!
    category: Category
  }

  input ExpenseFilter {
    amount: Float
    payerId: Int
    categoryId: Int
  }

  type Query {
    me: User
    expenses(filter: ExpenseFilter): [Expense!]!
    expense(id: Int!): Expense
    users: [User!]!
    categories: [Category!]!
  }

  input CreateExpenseInput {
    description: String!
    amount: Float!
    date: String!
    payerId: Int!
    participants: [Int!]
    categoryId: Int
  }

  type Mutation {
    createExpense(input: CreateExpenseInput!): Expense!
  }
`,

resolvers: {
    Expense: {
    date: (expense: Expense) => expense.date.toISOString(),
    },
    Query: {
      me: (_parent, _args, ctx) =>
        ctx.userJWT ? UsersService.getById(ctx.userJWT.userId) : null,

      expenses: (user, args, ctx) => {
        const current = requireAuth(ctx);
        // ...refuse unless user.id is the caller's own id
        return ExpensesService.getExpensesOfUser(user.id, args.filter ?? {});
      },
      expense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        const expense = await ExpensesService.getExpenseById(args.id);

        if (!expense) {
          throw new NotFoundError('Expense not found');
        }

        // Check if user is involved in this expense (as payer or participant)
        const isInvolved =
          expense.payer?.id === user.userId ||
          expense.participants.some(p => p.id === user.userId);

        if (!isInvolved) {
          throw new AuthorizationError("You don't have permission to view this expense");
        }

        return expense;
      },

      // Same question, same answer. `users` hands out names, emails and bank
      // accounts; `categories` is harmless, but a stranger has no business
      // enumerating either.
      users: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return UsersService.getUsers();
      },
      categories: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return CategoriesService.getCategories();
      },
    },
    Mutation: {
      createExpense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        // User can only create expenses where they are the payer
        if (user.userId !== args.input.payerId) {
          throw new AuthorizationError('You can only create expenses that you paid for');
        }

        const newExpense = parseNewExpense(args.input);
        if (newExpense === false) {
          throw new GraphQLError('Invalid expense');
        }
        return ExpensesService.addExpense(newExpense);
      },
    },
    User: {
      expenses: (user: {id: number}, args, ctx) => {
        const current = requireAuth(ctx);
        if (user.id !== current.userId) {
          throw new AuthorizationError("You can only read your own expenses");
        }
        return ExpensesService.getExpensesOfUser(user.id, args.filter ?? {});
      },
    },
  },
});