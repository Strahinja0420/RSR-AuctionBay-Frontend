import { zodResolver } from "@hookform/resolvers/zod";
import React, { Activity, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createAuction } from "../../api/auctions.api";

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

  return (
    <>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        {/* THE BLUR BEHIND IT */}
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => onClose()}
        />

        {/* THE ACTUAL MODAL */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white max-w-2/3 max-h-2/3 rounded-2xl m-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log("FORM ERRORS:", errors);
            })}
            className="space-y-4 max-w-xl"
          >
            <input
              {...register("title")}
              placeholder="Title"
              className="w-full border p-2"
            />
            {errors.title && <p>{errors.title.message}</p>}

            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full border p-2"
            />

            <input
              type="number"
              {...register("startingPrice")}
              placeholder="Starting price"
              className="w-full border p-2"
            />
            {errors.startingPrice && <p>{errors.startingPrice.message}</p>}

            <input
              type="number"
              {...register("buyNowPrice")}
              placeholder="Buy now price"
              className="w-full border p-2"
            />

            {errors.buyNowPrice && <p>{errors.buyNowPrice.message}</p>}

            <input
              type="datetime-local"
              {...register("startDate")}
              className="w-full border p-2"
            />

            {errors.startDate && <p>{errors.startDate.message}</p>}

            <input
              type="datetime-local"
              {...register("endDate")}
              className="w-full border p-2"
            />

            {errors.endDate && <p>{errors.endDate.message}</p>}

            <input
              type="number"
              {...register("categoryId")}
              placeholder="Category ID"
              className="w-full border p-2"
            />

            {errors.categoryId && <p>{errors.categoryId.message}</p>}

            {/* IMAGE UPLOAD */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files) return;
                setImages(Array.from(e.target.files));
              }}
            />

            <input
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
            ></input>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Activity>
    </>
  );
}

export default AddAuctionForm;
