import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  let navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
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

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-8 border shadow-2xl rounded-2xl bg-black/60 backdrop-blur-lg border-rose-900/40">
        <h1 className="mb-2 text-3xl font-bold text-center text-white">
          Auction Bay
        </h1>

        <p className="mb-6 text-center text-neutral-400">
          Sign in to continue bidding
        </p>

        <LoginForm onSubmit={handleLogin} />

        <p className="mt-6 text-sm text-center text-neutral-400">
          Don’t have an account?{" "}
          <Link
            to={"/register"}
            className="cursor-pointer text-rose-600 hover:text-rose-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
