import { useParams } from "react-router-dom";
import { useState } from "react";
import * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { API_BASE_URL } from "../api/axios";
import { useBids } from "../hooks/useBids";
import PageWithTopBar from "../components/layout/PageWithTopBar";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  CircleDollarSign,
} from "lucide-react";
import { useAuction } from "../hooks/useAuction";

function AuctionPage() {
  const { id } = useParams();
  const { auction, loading, error } = useAuction(id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const bidSchema = z.object({
    bid: z
      .number()
      .positive("Bid must be positive")
      .refine((v) => !auction || v > auction.currentPrice, {
        message: `Bid must be higher than current price (${auction?.currentPrice ?? 0}€)`,
      }),
  });

  type FormFields = z.infer<typeof bidSchema>;

  const { bids, placeBid } = useBids(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 bg-gray-50 p-4 text-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-[#7A2E3A]" />
        <p className="text-neutral-600 animate-pulse font-medium">
          Fetching the latest auction data...
        </p>
      </div>
    );
  } else if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600">Auction not found</h2>
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-[#7A2E3A] hover:underline"
        >
          Go back
        </button>
      </div>
    );
  } else if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-neutral-400">Not found</h2>
      </div>
    );
  }

  const images = auction.images;
  const currentImage = images.length > 0 ? images[selectedImageIndex] : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(bidSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await placeBid(data.bid);
    } catch (error) {
      console.error("Bid failed", error);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-50">
      {/* TOP BAR */}
      <PageWithTopBar />

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT COLUMN: IMAGE CAROUSEL */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-square w-full overflow-hidden bg-white border border-neutral-200 shadow-sm rounded-3xl">
              {currentImage ? (
                <img
                  src={`${API_BASE_URL}/uploads/${currentImage.imageUrl}`}
                  alt={auction.title}
                  className="object-contain w-full h-full p-1"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-neutral-400">
                  No image available
                </div>
              )}
            </div>

            {/* THUMBNAIL GALLERY */}
            {images.length > 1 && (
              <div className="relative flex items-center w-full px-12 py-3 bg-white border border-neutral-200 shadow-sm rounded-2xl">
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-3 z-10 p-1.5 transition-all bg-white border border-neutral-200 rounded-full shadow-sm text-[#7A2E3A] hover:bg-neutral-50 hover:scale-110 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center justify-start gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`
                        relative shrink-0 w-20 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2
                        ${selectedImageIndex === idx ? "border-[#7A2E3A] ring-2 ring-[#7A2E3A]/10 scale-105 shadow-md" : "border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0"}
                      `}
                    >
                      <img
                        src={`${API_BASE_URL}/uploads/${img.imageUrl}`}
                        alt={`Gallery ${idx}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextImage}
                  className="absolute right-3 z-10 p-1.5 transition-all bg-white border border-neutral-200 rounded-full shadow-sm text-[#7A2E3A] hover:bg-neutral-50 hover:scale-110 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* AUCTION INFO + BID */}
            <div className="flex flex-col p-6 md:p-8 bg-white border border-neutral-200 shadow-sm rounded-3xl">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#3B0F19]">
                  {auction.title}
                </h1>
                <div className="px-4 py-1.5 text-sm font-bold bg-[#E6C76E] text-[#3B0F19] rounded-full uppercase tracking-wider">
                  {auction.status}
                </div>
              </div>

              <p className="text-base text-neutral-600 leading-relaxed mb-8">
                {auction.description || "No description available"}
              </p>

              {auction.status === "ended" ? (
                <div className="mt-4 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center font-bold text-neutral-500">
                  This auction has ended.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* CURRENT PRICE INFO */}
                  <div className="flex items-end justify-between bg-[#4A1622]/5 p-6 rounded-2xl border border-[#4A1622]/10">
                    <div>
                      <p className="text-sm font-semibold text-[#7A2E3A] uppercase tracking-wide mb-1">
                        Current Bid
                      </p>
                      <p className="text-4xl font-black text-[#3B0F19]">
                        €{auction.currentPrice.toLocaleString()}
                      </p>
                    </div>
                    {auction.buyNowPrice && (
                      <div className="text-right">
                        <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">
                          Buy Now Price
                        </p>
                        <p className="text-xl font-bold text-[#7A2E3A]">
                          €{auction.buyNowPrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* BIDDING FORM */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col sm:flex-row gap-3 pt-4"
                  >
                    <div className="relative flex-1">
                      <input
                        {...register("bid", { valueAsNumber: true })}
                        type="number"
                        placeholder="Enter bid amount"
                        className={`w-full h-14 px-6 rounded-2xl border-2 transition-all outline-none text-lg font-bold
                          ${errors.bid ? "border-red-500 bg-red-50" : "border-neutral-200 focus:border-[#7A2E3A] focus:ring-4 focus:ring-[#7A2E3A]/5 bg-neutral-50"}`}
                      />
                      {errors.bid && (
                        <p className="absolute -top-6 right-0 text-sm font-bold text-red-500">
                          {errors.bid.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 px-10 font-black text-lg transition-all shadow-md bg-[#E6C76E] text-[#3B0F19] rounded-2xl hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "Placing Bid..." : "Place Bid"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* BIDDING HISTORY */}
            <div className="flex flex-col bg-white border border-neutral-200 shadow-sm rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-black text-[#3B0F19]">
                  Bidding history ({bids.length})
                </h2>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                {bids.length > 0 ? (
                  <div className="space-y-1">
                    {bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-[#3B0F19]">
                            {bid.user?.username ?? "Anonymous"}
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            {format(
                              new Date(bid.createdAt),
                              "HH:mm • dd.MM.yyyy",
                            )}
                          </span>
                        </div>
                        <div className="px-4 py-2 font-black text-[#3B0F19] bg-[#E6C76E] rounded-xl shadow-sm">
                          €{bid.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <CircleDollarSign
                        size={24}
                        className="text-neutral-300"
                      />
                    </div>
                    <p className="text-neutral-500 font-medium">
                      No bids yet. Be the first!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuctionPage;
