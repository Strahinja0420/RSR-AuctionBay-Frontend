import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateAuction } from "../../api/auctions.api";
import { useCategories } from "../../hooks/useCategories";
import type { Auction } from "../../types/Auction.type";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, FileText, DollarSign, Calendar, Tag } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  auction: Auction;
};

const editAuctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startingPrice: z.coerce.number().min(1, "Starting price must be at least 1"),
  buyNowPrice: z.coerce.number().positive().optional(),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (date) => new Date(date) > new Date(Date.now()),
      "Start date must be in the future",
    ),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine(
      (date) => new Date(date) > new Date(Date.now()),
      "End date must be in the future",
    ),
  categoryId: z.coerce.number().int().min(1, "Category is required"),
});

type FieldSchema = z.infer<typeof editAuctionSchema>;

function EditAuctionForm({ isOpen, onClose, auction }: Props) {
  const { categories } = useCategories();

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const z = (n: number) => (n < 10 ? "0" : "") + n;
    return (
      date.getFullYear() +
      "-" +
      z(date.getMonth() + 1) +
      "-" +
      z(date.getDate()) +
      "T" +
      z(date.getHours()) +
      ":" +
      z(date.getMinutes())
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editAuctionSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        buyNowPrice: auction.buyNowPrice,
        startDate: formatDateForInput(auction.startDate),
        endDate: formatDateForInput(auction.endDate),
        categoryId: auction.categoryId,
      });
    }
  }, [isOpen, auction, reset]);

  const onSubmit = async (data: FieldSchema) => {
    const updateData = {
      title: data.title,
      description: data.description,
      startingPrice: data.startingPrice,
      buyNowPrice: data.buyNowPrice,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      categoryId: data.categoryId,
      winnerId: "",
      status: "active",
    };

    console.log("📤 Sending update data:", updateData);

    try {
      await updateAuction(auction.id, updateData);
      alert("Auction updated successfully!");
      onClose();
    } catch (error: any) {
      alert(
        `Failed to update auction: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          />

          {/* MODAL CONTAINER */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="relative p-6 text-center border-b border-gray-100 shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-[#7A2E3A]"
                >
                  <X size={20} />
                </button>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7A2E3A]/5 text-[#7A2E3A]">
                  <Edit3 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[#3B0F19]">
                  Edit Auction Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Refine your listing for maximum impact
                </p>
              </div>

              {/* FORM CONTENT */}
              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form
                  id="edit-auction-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* TITLE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      Auction Title
                    </label>
                    <input
                      {...register("title")}
                      placeholder="e.g. Vintage 1960s Camera"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                    />
                    {errors.title && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.title.message as string}
                      </p>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Tell buyers what makes this item special..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10 resize-none"
                    />
                  </div>

                  {/* PRICES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        Starting Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          {...register("startingPrice")}
                          placeholder="0.00"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                        />
                      </div>
                      {errors.startingPrice && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.startingPrice.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign size={16} className="text-[#E6C76E]" />
                        Buy Now Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          {...register("buyNowPrice")}
                          placeholder="0.00"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10 border-dashed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DATES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        {...register("startDate")}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                      />
                      {errors.startDate && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.startDate.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar size={16} className="text-[#7A2E3A]" />
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        {...register("endDate")}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                      />
                      {errors.endDate && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.endDate.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag size={16} className="text-gray-400" />
                      Category
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.categoryId.message as string}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="flex gap-4 p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-white hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  form="edit-auction-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] rounded-xl bg-[#7A2E3A] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#7A2E3A]/20 transition-all hover:bg-[#4A1622] hover:shadow-[#4A1622]/30 disabled:opacity-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSubmitting ? "Updating..." : "Update Auction"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default EditAuctionForm;
