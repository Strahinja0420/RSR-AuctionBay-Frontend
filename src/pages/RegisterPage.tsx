import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import type { RegisterType } from "../types/Registration.type";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const { register } = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (data: RegisterType) => {
    try {
      await register(data.email, data.username, data.password);
      navigate("/profile")
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
