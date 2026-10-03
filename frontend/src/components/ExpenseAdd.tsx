import type { NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";


interface ExpenseAddProps {
  addExpense: (newExpense: NewExpense) => void;
}

type Inputs = {
  payer: string,
  date: string,
  description: string,
  amount : number
}

function ExpenseAdd ({addExpense} : ExpenseAddProps){
  const {register, handleSubmit, formState:{errors}, reset } = useForm<Inputs>()

  const onSubmit = (data: Inputs) => {
    const newExpense : NewExpense = {
      payer : data.payer,
      date: data.date,
      description: data.description,
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
            {...register("payer", {required:true})}
          >
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
        </div>

        <div>
          <label htmlFor="date">Date :</label>
          <label>
            Date :
            <input type = "date" {...register('date', {required:true})}  />
            {errors.date && <span>Date field is required </span>}
          </label>
        </div>

        <div>
          <label>
            Description :
            <input type = "string" {...register('description', {required:true})} placeholder="Enter description" />
            {errors.description && <span>Description field is required </span>}
          </label>
        </div>

        <div>
          <label>
            Amount:
            <input type="number" {...register('amount', { required: true, valueAsNumber: true })} placeholder="Enter amount" />
            {errors.amount && <span>Amount field is required</span>}
          </label>
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );

}

export default ExpenseAdd;