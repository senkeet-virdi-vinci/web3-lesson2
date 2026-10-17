import express from "express";
import { parseExpenseFilter, parseNewExpense, type Expense } from "../types/expense.ts";
import { ExpensesService } from "../services/expenses.service.ts";
import { error } from "console";

const expensesRouter = express.Router();

expensesRouter.get("/", async (req, res) => {
  try {
    const filter = parseExpenseFilter(req.query);
    if(!filter) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const expenses = await ExpensesService.getExpenses(filter);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

expensesRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const expense = await ExpensesService.getExpenseById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.post("/", async (req, res) => {
  try {
    const expense = parseNewExpense(req.body);
    if (!expense) {
      console.error(error)
      return res.status(400).json({ error: "Invalid expense" });
    }
    const created = await ExpensesService.addExpense(expense);
    res.status(201).json(created);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" });
  }
});

expensesRouter.post("/reset", async (req, res) => {
  try {
    const expenses = await ExpensesService.resetExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default expensesRouter;