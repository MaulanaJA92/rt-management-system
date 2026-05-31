import api from "./axios";

export const authLogin = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const authLogout = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
