import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (username: string, email: string) => Promise<void>;
  onOpenChangePassword: () => void;
};

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email address"),
});

type FormFields = z.infer<typeof schema>;

function ProfileSettingsForm({
  isOpen,
  onClose,
  onUpdate,
  onOpenChangePassword,
}: Props) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl bg-gray-50 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <h2 className="mb-1 text-xl font-semibold text-red-900 text-center">
            Profile settings
          </h2>
          <p className="mb-6 text-sm text-gray-500 text-center">
            Update your account information
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
              />
              {errors.username && (
                <span className="text-xs text-red-600">
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
              />
              {errors.email && (
                <span className="text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Extra actions */}
            <div className="flex flex-col gap-2 pt-2 text-sm">
              <button
                type="button"
                className="text-left text-red-900 hover:underline"
                onClick={onOpenChangePassword}
              >
                Change password
              </button>

              <button
                type="button"
                className="text-left text-red-900 hover:underline"
              >
                Change profile picture
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-700
                           hover:bg-gray-200 hover:cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-red-900 px-4 py-2 text-sm
                           font-medium text-white hover:bg-red-800 hover:cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileSettingsForm;
