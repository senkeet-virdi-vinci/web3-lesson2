import { useState } from "react";
import type { Expense } from "../types/Expense";


interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

function ExpenseAdd ({addExpense} : ExpenseAddProps){
  const [payer, setPayer] = useState<string>("Bob");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");


  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newExpense : Expense = {
      id: crypto.randomUUID(),
      payer,
      date,
      description,
      amount : parseFloat(amount) || 0,
    };

    await addExpense(newExpense);

    setPayer("Bob");
    setDate("");
    setDescription("");
    setAmount("");

  }


  return (
    <div>
      <h2>Add a new expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="payer">Payer :</label>
          <select
            id="payer"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          >
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
        </div>

        <div>
          <label htmlFor="date">Date :</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="amount">Amount :</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );


}



export default ExpenseAdd;