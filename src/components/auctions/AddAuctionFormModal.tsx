import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createAuction } from "../../api/auctions.api";
import { Upload } from "lucide-react";

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
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-2xl rounded-2xl bg-gray-50 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <h2 className="mb-1 text-xl font-semibold text-red-900 text-center">
            Create new auction
          </h2>
          <p className="mb-6 text-sm text-gray-500 text-center">
            Fill in auction details
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* TITLE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
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
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                             focus:border-red-900 focus:outline-none
                             focus:ring-2 focus:ring-red-900/20"
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                             focus:border-red-900 focus:outline-none
                             focus:ring-2 focus:ring-red-900/20"
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                             focus:border-red-900 focus:outline-none
                             focus:ring-2 focus:ring-red-900/20"
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                             focus:border-red-900 focus:outline-none
                             focus:ring-2 focus:ring-red-900/20"
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
              <input
                type="number"
                {...register("categoryId")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
              />
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
                className="inline-flex cursor-pointer items-center justify-center
             rounded-lg border border-amber-400 bg-white px-4 py-2
             text-sm font-medium text-amber-600
             hover:bg-amber-50"
              >
                <Upload size={16} className="mr-2"></Upload>
                Choose images
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto items-center ">
                {images.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);

                  return (
                    <div
                      key={index}
                      className=" h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-300 mx-auto"
                    >
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-700
                           hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-red-900 px-4 py-2 text-sm
                           font-medium text-white hover:bg-red-800
                           disabled:opacity-60"
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
