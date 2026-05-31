import api from "./axios";


export const getHouses = async () => {
  try {
    const response = await api.get("/houses");
    return response.data;
  } catch (error) {
    console.error("Error fetching houses:", error);
    throw error;
  }
};
export const getAvailableResidents = async () => {
  try {
    const response = await api.get("/available-residents");
    return response.data;
    } catch (error) {
    console.error("Error fetching available residents:", error);
    throw error;
  }
};
export const createHouse = async (houseData:any) => {
  try {
    const response = await api.post('/houses', houseData);
    return response.data;
  } catch (error) {
    console.error('Error creating house:', error);
    throw error;
  }
};
export const updateHouse = async (id: number, houseData:any) => {
  try {
    const response = await api.put(`/houses/${id}`, houseData);
    return response.data;
  } catch (error) {
    console.error('Error updating house:', error);
    throw error;
  }
};
export const deleteHouse = async (id: number) => {
  try {
    const response = await api.delete(`/houses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting house:", error);
    throw error;
  }
};
