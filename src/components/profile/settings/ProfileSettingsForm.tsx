import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  onUpdate: (username: string, email: string) => Promise<void>;
};

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type FormFields = z.infer<typeof schema>;

function ProfileSettingsForm({ isOpen, onClose, onUpdate }: Props) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormFields) => {
    await onUpdate(data.username, data.email);
    onClose();
  };

  return (
    <>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => onClose()}
        />

        <div className="fixed flex inset-0 z-50 bg-white rounded-2xl w-100 h-100 items-center justify-center m-auto">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2>Profile settings</h2>

              <div>
                <label>Username</label>
                <input type="text" {...register("username")} />
                {errors.username && <span>{errors.username.message}</span>}
              </div>

              <div>
                <label>Email</label>
                <input type="email" {...register("email")} />
                {errors.email && <span>{errors.email.message}</span>}
              </div>

              <div>
                <a href="#">Change password</a>
                <br />
                <a href="#">Change profile picture</a>
              </div>

              <div>
                <button className="hover:cursor-pointer" type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className="hover:cursor-pointer" type="submit">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </Activity>
    </>
  );
}

export default ProfileSettingsForm;
