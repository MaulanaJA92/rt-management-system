import api from "./axios";
export const getReport = async (periodMonth: string) => {
  try {
    const [year, month] = periodMonth.split("-");
    const response = await api.get("/report", {
      params: {
        month: month,
        year: year,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};
