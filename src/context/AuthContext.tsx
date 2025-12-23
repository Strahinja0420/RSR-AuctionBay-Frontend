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
  updateUser: (username: string, email: string) => Promise<void>;
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
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data);
        //console.log(isAuthenticated);
        //isAuthenticated == true;
      } catch (error) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (username: string, email: string) => {
    try {
      const response = await api.patch("/users/me", {
        username,
        email,
      });

      const updateUser = response.data;

      setUser(updateUser);

      return updateUser;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to update user"
        );
      }

      throw new Error("Unable to connect to server");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
