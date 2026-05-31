import api from './axios'

export const getResidents = async () => {
  try {
    const response = await api.get('/residents');
    return response.data;
  } catch (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }
};
export const getResidentById = async (id: number) => {
  try {
    const response = await api.get(`/residents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resident by ID:', error);
    throw error;
  }
};
export const createResident = async (formData: FormData) => {
  try {
    const response = await api.post('/residents', formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },});
    return response.data;
  } catch (error) {
    console.error('Error creating resident:', error);
    throw error;
  }
};
export const updateResident = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/residents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: { _method: 'PUT' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating resident:', error);
    throw error;
  }
};
export const deleteResident = async (id: number) => {
  try {
    const response = await api.delete(`/residents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting resident:', error);
    throw error;
  }
};