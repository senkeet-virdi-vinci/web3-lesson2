import { zodResolver } from "@hookform/resolvers/zod";
import type { NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";
import {z} from "zod";

interface ExpenseAddProps {
  addExpense: (newExpense: NewExpense) => void;
}

const expenseSchema = z.object({
  payer: z.enum(["Bob", "Alice"], {
    message: "Payer must be Bob or Alice"
  }),


  date: z.string().min(1, "Date is required"),

  description : z
  .string()
  .max(200, "Description connot exceed 200 characters")
  .optional(),

  amount: z
  .number({
    message: "Amount is required"
  })
  .positive("Amount must be positive")

})

type Inputs = z.infer<typeof expenseSchema>;

function ExpenseAdd ({addExpense} : ExpenseAddProps){
  const {register, handleSubmit, formState:{errors}, reset } = useForm<Inputs>({resolver : zodResolver(expenseSchema)})

  const onSubmit = (data: Inputs) => {
    const newExpense : NewExpense = {
      payer : data.payer,
      date: data.date,
      description: data.description ?? "",
      amount : data.amount
    };

    addExpense(newExpense);
    reset();
  }


  return (
    <div>
      <h2>Add a new expense</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="payer">Payer :</label>
          <select
            id="payer"
            {...register("payer", )}
          >
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>

          {errors.payer && <span>{errors.payer?.message}</span>}
        </div>

        <div>
          <label htmlFor="date">Date :</label>
          <label>
            Date :
            <input type = "date" {...register('date')}  />
            {errors.date && <span>{errors.date.message} </span>}
          </label>
        </div>

        <div>
          <label>
            Description :
            <input type = "string" {...register('description')} placeholder="Enter description" />
            {errors.description && <span>{errors.description.message} </span>}
          </label>
        </div>

        <div>
          <label>
            Amount:
            <input type="number" {...register('amount', {valueAsNumber: true })} placeholder="Enter amount" />
            {errors.amount && <span>{errors.amount.message} </span>}
          </label>
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );

}

export default ExpenseAdd;