import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
        await login(email, password);
    } catch (error) {
        console.log(error);
        
    }
  };

  return (
    <>
      <LoginForm onSubmit={handleLogin}></LoginForm>
    </>
  );
}

export default LoginPage;
