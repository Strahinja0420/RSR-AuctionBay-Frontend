import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import type { RegisterType } from "../types/registerTypes";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const { register } = useAuth();

  const handleSubmit = async (data: RegisterType) => {
    try {
      await register(data.email, data.username, data.password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <RegisterForm onSubmit={handleSubmit}></RegisterForm>
    </>
  );
}

export default RegisterPage;
