import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "../api/axios";
import type { User } from "../types/User.type";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (username: string, email: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    console.log(response.data);

    const user = response.data.user;
    const accessToken = response.data.access_token;

    localStorage.setItem("access_token", accessToken);
    setUser(user);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    const response = await api.post("auth/register", {
      username,
      email,
      password,
      role,
    });

    const user = response.data.user;
    const accessToken = response.data.access_token;
    localStorage.setItem("access_token", accessToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error: any) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (username: string, email: string) => {
    const response = await api.patch("/users/me", {
      username,
      email,
    });

    const updateUser = response.data;
    setUser(updateUser);
    return updateUser;
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    await api.patch("/users/me/password", {
      oldPassword,
      newPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
