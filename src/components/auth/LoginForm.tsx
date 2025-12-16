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
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <label>Email</label>
        <input
        type = "email"
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

export default LoginForm;
