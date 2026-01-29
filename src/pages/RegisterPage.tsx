import RegisterForm from "../components/auth/RegisterForm";
import type { RegisterType } from "../types/Registration.type";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const { register } = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (data: RegisterType) => {
    try {
      await register(data.username, data.email, data.password);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a')",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/75" />

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-md p-8 border shadow-2xl rounded-2xl bg-black/60 backdrop-blur-lg border-rose-900/40">
        <h1 className="mb-2 text-3xl font-bold text-center text-white">
          Auction Bay
        </h1>

        <p className="mb-6 text-center text-neutral-400">Create your account</p>

        <RegisterForm onSubmit={handleSubmit} />

        <p className="mt-6 text-sm text-center text-neutral-400">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="cursor-pointer text-rose-600 hover:text-rose-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
