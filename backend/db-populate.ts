import { Temporal } from "temporal-polyfill";
import { db } from "./src/prisma/db.ts";

async function findOrCreateUser(name: string, email: string) {
  const existing = await db.orm.public.User.first({ email });
  if (existing) return existing;
  return db.orm.public.User.create({ name, email });
}

async function findOrCreateCategory(name: string, colour: string) {
  const existing = await db.orm.public.Category.first({ name });
  if (existing) return existing;
  return db.orm.public.Category.create({ name, colour });
}

async function main() {
  const alice = await findOrCreateUser("Alice", "alice@gmail.com");
  const bob = await findOrCreateUser("Bob", "bob@gmail.com");

  const food = await findOrCreateCategory("Food", "#e67e22");
  const transport = await findOrCreateCategory("Transport", "#3498db");
  const leisure = await findOrCreateCategory("Leisure", "#9b59b6");
  const housing = await findOrCreateCategory("Housing", "#2ecc71");

  const existingExpenses = await db.orm.public.Expense.all();

  if (existingExpenses.length === 0) {
    await db.orm.public.Expense.create({
      date: Temporal.Instant.from("2025-01-16T00:00:00Z"),
      description: "Example expense #1 from Alice",
      amount: 25.5,
      payer: (payer) => payer.connect({ id: alice.id }),
      category: (category) => category.connect({ id: food.id }),
    });

    await db.orm.public.Expense.create({
      date: Temporal.Instant.from("2025-01-15T00:00:00Z"),
      description: "Example expense #2 from Bob",
      amount: 35,
      payer: (payer) => payer.connect({ id: bob.id }),
      category: (category) => category.connect({ id: transport.id }),
    });

    await db.orm.public.Expense.create({
      date: Temporal.Instant.from("2025-01-15T00:00:00Z"),
      description: "Example expense #3 from Alice",
      amount: 2,
      payer: (payer) => payer.connect({ id: alice.id }),
    });

    await db.orm.public.Transfer.create({
      amount: 10,
      source: (source) => source.connect({ id: alice.id }),
      target: (target) => target.connect({ id: bob.id }),
    });

    console.log("Dépenses d'exemple créées.");
  } else {
    console.log(`${existingExpenses.length} dépense(s) déjà présentes, rien n'est modifié.`);
  }

  console.log("Utilisateurs :", alice, bob);
  console.log("Catégories :", food, transport, leisure, housing);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });