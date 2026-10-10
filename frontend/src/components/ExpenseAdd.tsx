import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ExpenseAddProps {
  addExpense: (newExpense: NewExpense) => void;
  categories: Category[];
}

const expenseSchema = z.object({
  payerId: z.number({ message: "Payer is required" }),

  date: z.string().min(1, "Date is required"),

  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),

  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be positive"),
  
  categoryId: z.number({ message: "Category is required" }),
});

type Inputs = z.infer<typeof expenseSchema>;

function ExpenseAdd({ addExpense, categories }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(expenseSchema) });

  const onSubmit = (data: Inputs) => {
    const newExpense: NewExpense = {
      payerId: data.payerId,
      categoryId: data.categoryId,
      date: new Date(data.date).toISOString(),
      description: data.description ?? "",
      amount: data.amount,
    };

    addExpense(newExpense);
    reset();
  };

  return (
    <div>
      <h2>Add a new expense</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="payer">Payer :</label>
          <select id="payer" {...register("payerId", { valueAsNumber: true })}>
            <option value={1}>Bob</option>
            <option value={2}>Alice</option>
          </select>
          {errors.payerId && <span>{errors.payerId.message}</span>}
        </div>

        <div>
          <label>
            Date :
            <input type="date" {...register("date")} />
          </label>
          {errors.date && <span>{errors.date.message}</span>}
        </div>

        <div>
          <label>
            Description :
            <input
              type="text"
              {...register("description")}
              placeholder="Enter description"
            />
          </label>
          {errors.description && <span>{errors.description.message}</span>}
        </div>

        <div>
          <label>
            Amount :
            <input
              type="number"
              step="any"
              {...register("amount", { valueAsNumber: true })}
              placeholder="Enter amount"
            />
          </label>
          {errors.amount && <span>{errors.amount.message}</span>}
        </div>

        <div>
          <label htmlFor="category">Category :</label>
          <select id="category" defaultValue="" {...register("categoryId", { valueAsNumber: true })}>
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span>{errors.categoryId.message}</span>}
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;