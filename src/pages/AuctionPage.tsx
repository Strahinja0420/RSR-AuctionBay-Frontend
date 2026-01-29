import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bidOnAuction } from "../api/auctions.api";
import { format } from "date-fns";
import { API_BASE_URL } from "../api/axios";
import type { Bid } from "../types/Bid.type";
import { useBidders } from "../hooks/useBidders";
import PageWithTopBar from "../components/layout/PageWithTopBar";
import { fetchBidsByAuction } from "../api/bids.api";
import { ChevronLeft, ChevronRight } from "lucide-react";

function AuctionPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const auction = state?.auction;

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

  const [bids, setBids] = useState<Bid[]>(auction?.bids ?? []);

  const { bidders } = useBidders(bids);

  if (!auction) {
    return <div className="p-6">Loading auction…</div>;
  }

  const images = auction.images;
  const currentImage = images.length > 0 ? images[selectedImageIndex] : null;

  useEffect(() => {
    if (!id) return;

    const loadBids = async () => {
      try {
        const data = await fetchBidsByAuction(id);
        setBids(data);
      } catch (err) {
        console.error("Failed to fetch bids", err);
      }
    };

    loadBids();
  }, [id]);

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
    if (!id) return;

    try {
      await bidOnAuction(data.bid, id);
      const updatedBids = await fetchBidsByAuction(id);
      setBids(updatedBids);
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
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <PageWithTopBar />

      {/* CONTENT */}
      <div
        className="grid flex-1 grid-cols-1 gap-6 p-6 overflow-auto lg:grid-cols-2"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {/* LEFT COLUMN: IMAGE CAROUSEL */}
        <div className="flex flex-col h-full gap-4">
          <div className="relative flex-1 overflow-hidden bg-white border shadow-md rounded-3xl border-neutral-200">
            {currentImage ? (
              <img
                src={`${API_BASE_URL}/uploads/${currentImage.imageUrl}`}
                alt={auction.title}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-neutral-400">
                No image available
              </div>
            )}
          </div>

          {/* THUMBNAIL GALLERY */}
          {images.length > 1 && (
            <div className="relative flex items-center w-full px-10 py-2 bg-white border shadow-sm group h-28 rounded-3xl border-neutral-200">
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 z-10 p-1 transition-colors bg-white border rounded-full shadow-sm text-[#7A2E3A] hover:bg-gray-50 border-neutral-200"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative flex justify-center w-full h-full overflow-hidden">
                <div 
                  className="flex items-center gap-4 transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(calc(50% - ${selectedImageIndex * 112 + 56}px))` 
                  }}
                >
                  {images.map((img: any, idx: number) => (
                    <div
                      key={img.id}

                      onClick={() => setSelectedImageIndex(idx)}
                      className={`
                        relative shrink-0 w-24 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                        ${selectedImageIndex === idx ? 'ring-2 ring-[#7A2E3A] scale-110 shadow-lg z-10' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0 scale-90'}
                      `}
                    >
                      <img
                        src={`${API_BASE_URL}/uploads/${img.imageUrl}`}
                        alt={`Gallery ${idx}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={nextImage}
                className="absolute right-2 z-10 p-1 transition-colors bg-white border rounded-full shadow-sm text-[#7A2E3A] hover:bg-gray-50 border-neutral-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>


        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* AUCTION INFO + BID */}
          <div className="flex flex-col p-6 bg-white border shadow-sm rounded-3xl border-neutral-200">
            <h1 className="text-3xl font-bold text-[#7A2E3A]">
              {auction.title}
            </h1>

            <p className="mt-2 text-sm text-neutral-600">
              {auction.description || "No description available"}
            </p>

            {auction.status === "ended" ? (
              <div className="mt-6 font-semibold text-center text-neutral-500">
                This auction has ended.
              </div>
            ) : (
              <>
                {errors.bid && (
                  <p className="text-sm text-red-500 text-end">
                    {errors.bid.message}
                  </p>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex gap-4 mt-4 ml-auto"
                >
                  <div>
                    <input
                      {...register("bid", { valueAsNumber: true })}
                      type="number"
                      placeholder="Your bid"
                      className="w-32 px-4 py-2 rounded-xl border border-neutral-300 focus:border-0 focus:ring-2 focus:ring-[#7A2E3A] outline-noneappearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none "
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 font-semibold transition shadow-sm primary-yellow-bg text-primary rounded-xl hover:shadow-md disabled:opacity-50 hover:ring-2 hover:ring-[#7A2E3A]"
                  >
                    {isSubmitting ? "Placing…" : "Place bid"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* BIDDING HISTORY */}
          <div className="flex-1 p-6 overflow-auto bg-white border shadow-sm rounded-3xl border-neutral-200">
            <h2 className="text-2xl font-bold text-[#7A2E3A] mb-4">
              Bidding history ({bids.length})
            </h2>

            {bids.length > 0 ? (
              bids.map((bid) => {
                const bidder = bidders.find((u) => u.id === bid.placedById);

                return (
                  <div
                    key={bid.id}
                    className="px-4 py-3 transition rounded-xl hover:bg-gray-50"
                  >
                    <div className="grid items-center grid-cols-3 gap-4">
                      <p className="text-sm font-medium text-neutral-800">
                        {bidder?.username ?? "Loading…"}
                      </p>

                      <p className="text-xs text-center text-neutral-500">
                        {format(new Date(bid.createdAt), "HH:mm dd.MM.yyyy")}
                      </p>

                      <p className="px-4 py-1 font-semibold text-right rounded-full primary-yellow-bg">
                        {bid.amount.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-neutral-500">No bids yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionPage;
