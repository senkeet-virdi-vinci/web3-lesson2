import { Temporal } from "temporal-polyfill";

import { db } from './src/prisma/db.ts';

async function resetDatabase() {
  const transfers = await db.orm.public.Transfer.all();

  for (const transfer of transfers) {
    await db.orm.public.Transfer.where({ id: transfer.id }).delete();
  }

  const expenses = await db.orm.public.Expense.all();

  for (const expense of expenses) {
    await db.orm.public.Expense.where({ id: expense.id }).delete();
  }

  const users = await db.orm.public.User.all();

  for (const user of users) {
    await db.orm.public.User.where({ id: user.id }).delete();
  }
}

async function main() {
  await resetDatabase();

  const alice = await db.orm.public.User.create({
    name: "Alice",
    email: "alice@gmail.com",
  });

  const bob = await db.orm.public.User.create({
    name: "Bob",
    email: "bob@gmail.com",
  });

  const expense1 = await db.orm.public.Expense.create({
    date: Temporal.Instant.from("2025-01-16T00:00:00Z"),
    description: "Example expense #1 from Alice",
    amount: 25.5,
    payer: (payer) => payer.connect({ id: alice.id }),
  });

  const expense2 = await db.orm.public.Expense.create({
    date: Temporal.Instant.from("2025-01-15T00:00:00Z"),
    description: "Example expense #2 from Bob",
    amount: 35,
    payer: (payer) => payer.connect({ id: bob.id }),
  });

  const expense3 = await db.orm.public.Expense.create({
    date: Temporal.Instant.from("2025-01-15T00:00:00Z"),
    description: "Example expense #3 from Alice",
    amount: 2,
    payer: (payer) => payer.connect({ id: alice.id }),
  });

  const transfer = await db.orm.public.Transfer.create({
    amount: 10,
    source: (source) => source.connect({ id: alice.id }),
    target: (target) => target.connect({ id: bob.id }),
  });

  console.log("Utilisateurs créés :", alice, bob);
  console.log("Dépenses créées :", expense1, expense2, expense3);
  console.log("Transaction créée :", transfer);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });