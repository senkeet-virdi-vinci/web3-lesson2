import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';

import './index.css';
import Layout from './pages/Layout.tsx';
import ExpenseList from './pages/expenses/ExpenseList.tsx';
import ExpenseNew from './pages/expenses/ExpenseNew.tsx';
import ExpenseShow from './pages/expenses/ExpenseShow.tsx';
import { expenseListLoader } from './pages/expenses/ExpenseList.loader.ts';
import Welcome from './pages/Welcome.tsx';
import { expenseShowLoader } from './pages/expenses/ExpenseShow.loader.ts';
import Login from './pages/auth/Login.tsx';
import { requireAuth } from './lib/requireAuth.ts';

const router = createBrowserRouter([
  {
    // No path here: a layout route only exists to wrap its children.
    Component: Layout,
    children: [
      { index: true, Component: Welcome },

      { path: "login", Component: Login },

      {
        middleware:[requireAuth],
        children:[
          { path: 'expenses', Component: ExpenseList, loader: expenseListLoader },
          { path: 'expenses/new', Component: ExpenseNew },
          { path: 'expenses/:id', Component: ExpenseShow, loader: expenseShowLoader},
        ]
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);