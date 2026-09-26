import { db } from './src/prisma/db.ts';

async function main() {
  const expensesData = [
    {
      date: new Date("2025-01-16").toISOString(),
      description: "Example expense #1 from Alice",
      amount: 25.50,
      payer: "Alice"
    },
    {
      date: new Date("2025-01-15").toISOString(),
      description: "Example expense #2 from Bob",
      amount: 35.00,
      payer: "Bob"
    },
    {
      date: new Date("2025-01-15").toISOString(),
      description: "Example expense #3 from Alice",
      amount: 2.00,
      payer: "Alice"
    }
  ];

  const createdExpenses = await db.orm.public.Expense.createAll(expensesData);

  console.log("Dépenses ajoutées avec succès :", createdExpenses);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });