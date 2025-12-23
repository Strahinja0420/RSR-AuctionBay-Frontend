import api from "./axios";

export const updateUser = async (data: { username: string; email: string }) => {
  try {
    return api.patch("/users/me", data);
  } catch (error) {
    console.log(error);
  }
};
