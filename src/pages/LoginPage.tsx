import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  let navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
        await login(email, password);
        navigate("/profile")
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
