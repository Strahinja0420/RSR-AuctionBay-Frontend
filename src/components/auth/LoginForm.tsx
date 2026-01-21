import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormFields = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
};

function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = (data: FormFields) => {
    //console.log(data);

    onSubmit(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {/* EMAIL */}
      <div>
        <label className="block mb-1 text-sm text-neutral-300">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full px-4 py-3 text-white border rounded-lg bg-neutral-900 border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-rose-700"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block mb-1 text-sm text-neutral-300">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="w-full px-4 py-3 text-white border rounded-lg bg-neutral-900 border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-rose-700"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full py-3 font-semibold text-white transition rounded-lg bg-rose-800 hover:bg-rose-700"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
