import type { IncomeFormData } from "../types";
import api from "./axios";

export const getIncomes = async (periodMonth: string) => {
  try {
    const [year, month] = periodMonth.split("-");
    const response = await api.get("/payments" ,{
      params: {
        month: month,
        year: year,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }
};

export const getHouses = async () => {
  try {
    const response = await api.get("/active-houses");
    return response.data;
  } catch (error) {
    console.error("Error fetching houses:", error);
    throw error;
  }
};
export const getFees = async (selectedHouseId: number, periodMonth: string) => {
  try {
   const response = await api.get('/payment-status', {
          params: {
            house_id: selectedHouseId,
            period_date: `${periodMonth}-01`
          }});
    return response.data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error;
  }
};


export const createIncome = async (income: Omit<IncomeFormData, 'id'>) => {
  try {
    const response = await api.post('/payments', income);
    return response.data;
  } catch (error) {
    console.error('Error creating income:', error);
    throw error;
  }
};

export const deleteIncome = async (id: number) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting income:", error);
    throw error;
  }
};