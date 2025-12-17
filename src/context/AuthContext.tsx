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
  username: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
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
    //console.log({email,password});

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      console.log(response.data);

      const user = response.data.user;
      const accessToken = response.data.access_token;

      localStorage.setItem("access_token", accessToken);
      setUser(user);
      console.log(`Login successfull your key is : ${accessToken}`);
    } catch (error: any) {
      // Axios error
      if (error.response) {
        // Backend responded with status code
        const message =
          error.response.data?.message || "Invalid email or password";

        throw new Error(message);
      }

      // Network / unknown error
      throw new Error("Unable to connect to server");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.post("auth/register", {
        username,
        email,
        password,
      });

      const user = response.data.user;
      const accessToken = response.data.access_token;
      localStorage.setItem("access_token", accessToken);
      setUser(user);
      console.log(`Registration successfull your key is : ${accessToken}`);
    } catch (error: any) {
      // Axios error
      if (error.response) {
        // Backend responded with status code
        const message =
          error.response.data?.message || "Invalid email or password";

        throw new Error(message);
      }

      // Network / unknown error
      throw new Error("Unable to connect to server");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("access_token");
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
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
