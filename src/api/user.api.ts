import type { User } from "../types/User.type";
import api from "./axios";

export const updateUser = async (data: { username: string; email: string }) => {
  try {
    return api.patch("/users/me", data);
  } catch (error: any) {
    console.error("Bid error status:", error.response?.status);
    console.error("Bid error data:", error.response?.data);
    console.error("Bid error message:", error.message);
    throw error;
  }
};

export const fetchUser = async (id: string): Promise<User> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Bid error status:", error.response?.status);
    console.error("Bid error data:", error.response?.data);
    console.error("Bid error message:", error.message);
    throw error;
  }
};
