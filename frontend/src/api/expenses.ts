import api from "./axios";
import type { Expense } from "../types";

export const getExpenses = async (periodMonth: string) => {
  try {
     const [year, month] = periodMonth.split("-");
    const response = await api.get("/expenses",{
      params: {
        month: month,
        year: year,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};


export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    const response = await api.post('/expenses', expense);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};
export const deleteExpense = async (id: number) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};