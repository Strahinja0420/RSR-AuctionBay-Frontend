import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { RegisterType } from "../../types/registerTypes";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormFields = z.infer<typeof loginSchema>;

type RegisterFormProps = {
  onSubmit: (data : RegisterType) => void;
};

function RegisterForm({ onSubmit }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const submitHandler = (data: FormFields) => {
    //console.log(data);

    onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="">Username</label>
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <div className="text-red-500">{errors.username.message}</div>
        )}
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        <label htmlFor="">Password</label>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <input type="submit"></input>
      </form>
    </>
  );
}

export default RegisterForm;
