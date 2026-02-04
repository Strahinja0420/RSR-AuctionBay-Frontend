import type { User } from "../types/User.type";
import api from "./axios";

export const updateUser = async (data: { username: string; email: string }) => {
  return api.patch("/users/me", data);
};

export const fetchUser = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};
