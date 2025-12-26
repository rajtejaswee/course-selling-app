import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/users/register", userData);

  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/users/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");

  return response.data;
};

export const adminLogin = async (credentials) => {
  const response = await api.post("/admins/login", credentials);
  return response.data;
};

export const adminRegister = async (userData) => {
  const response = await api.post("/admins/register", userData);
  return response.data;
};
