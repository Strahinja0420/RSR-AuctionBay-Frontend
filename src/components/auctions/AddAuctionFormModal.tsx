import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createAuction } from "../../api/auctions.api";
import { Upload } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const createAuctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startingPrice: z.string().min(1),
  buyNowPrice: z.coerce.number().positive().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  categoryId: z.coerce.number().int().min(1, "category is required"),
});

type FieldSchema = z.infer<typeof createAuctionSchema>;

function AddAuctionForm({ isOpen, onClose }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAuctionSchema),
  });

  const onSubmit = async (data: FieldSchema) => {
    console.log("Submit working", data);

    const formData = new FormData();

    // TEXT FIELDS (must match backend)
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("startingPrice", String(data.startingPrice));
    if (data.buyNowPrice !== undefined) {
      formData.append("buyNowPrice", String(data.buyNowPrice));
    }
    formData.append("startDate", new Date(data.startDate).toISOString());
    formData.append("endDate", new Date(data.endDate).toISOString());
    formData.append("categoryId", String(data.categoryId));

    // FILES
    images.forEach((file) => {
      formData.append("images", file);
    });

    /*
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    */

    try {
      //console.log("axios sending");

      await createAuction(formData);
      alert("Auction created");
      onClose();
      //console.log("axios works");
    } catch (error) {
      console.log(error);
    }
  };
  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* MODAL */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl p-6 shadow-2xl rounded-2xl bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <h2 className="mb-1 text-xl font-semibold text-center text-red-900">
            Create new auction
          </h2>
          <p className="mb-6 text-sm text-center text-gray-500">
            Fill in auction details
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* TITLE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title")}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
              />
              {errors.title && (
                <span className="text-xs text-red-600">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
              />
            </div>

            {/* PRICES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Starting price
                </label>
                <input
                  type="number"
                  {...register("startingPrice")}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
                {errors.startingPrice && (
                  <span className="text-xs text-red-600">
                    {errors.startingPrice.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Buy now price
                </label>
                <input
                  type="number"
                  {...register("buyNowPrice")}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Start date
                </label>
                <input
                  type="datetime-local"
                  {...register("startDate")}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
                {errors.startDate && (
                  <span className="text-xs text-red-600">
                    {errors.startDate.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  End date
                </label>
                <input
                  type="datetime-local"
                  {...register("endDate")}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
                {errors.endDate && (
                  <span className="text-xs text-red-600">
                    {errors.endDate.message}
                  </span>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Category ID
              </label>
              <select
                {...register("categoryId")}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-xs text-red-600">
                  {errors.categoryId.message}
                </span>
              )}
            </div>

            {/* IMAGES */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;
                  setImages(Array.from(e.target.files));
                }}
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border rounded-lg cursor-pointer border-amber-400 text-amber-600 hover:bg-amber-50"
              >
                <Upload size={16} className="mr-2"></Upload>
                Choose images
              </label>
            </div>
            {images.length > 0 && (
              <div className="flex items-center gap-2 mt-2 overflow-x-auto ">
                {images.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);

                  return (
                    <div
                      key={index}
                      className="w-20 h-20 mx-auto overflow-hidden border border-gray-300 rounded-lg shrink-0"
                    >
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover w-full h-full"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* FOOTER */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-900 rounded-lg hover:bg-red-800 disabled:opacity-60"
              >
                Create auction
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddAuctionForm;
