import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X } from "lucide-react";
import { createCategory } from "../../api/categories.api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().max(200, "Description must be under 200 characters"),
});

type FieldSchema = z.infer<typeof createCategorySchema>;

function AddCategoryModal({ isOpen, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const categoryName = watch("name");
  const description = watch("description");

  // Mock slug generation
  const slug = categoryName
    ? categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : "";

  const onSubmit = async (data: FieldSchema) => {
    try {
      await createCategory(data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto transform transition-all animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Category
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* CATEGORY NAME */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Fine Art"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#7A2E3A] focus:ring-4 focus:ring-[#7A2E3A]/10 outline-none transition-all placeholder:text-gray-400"
              />
              {errors.name && (
                <p className="text-xs font-medium text-rose-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* URL SLUG PREVIEW */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-sm font-bold text-gray-700">
                URL Slug
              </label>
              <input
                value={slug}
                disabled
                placeholder="fine-art"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-500 pl-1 font-medium italic">
                Preview: /category/{slug || "..."}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Description
                </label>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {description?.length || 0} / 200
                </span>
              </div>
              <textarea
                {...register("description")}
                placeholder="Briefly describe what items belong in this category..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#7A2E3A] focus:ring-4 focus:ring-[#7A2E3A]/10 outline-none transition-all resize-none placeholder:text-gray-400"
              />
              {errors.description && (
                <p className="text-xs font-medium text-rose-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-[#7A2E3A] text-white rounded-xl text-sm font-bold hover:bg-[#63252E] shadow-lg shadow-[#7A2E3A]/20 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCategoryModal;
