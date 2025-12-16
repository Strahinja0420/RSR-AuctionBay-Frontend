import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../api/axios";

type User = {
  id: string;
  email: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    };

    setIsLoading(false);
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
