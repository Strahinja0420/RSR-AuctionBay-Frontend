import { API_BASE_URL } from "../../api/axios";
import type { Auction } from "../../types/Auction.type";
import { useAuth } from "../../hooks/useAuth";
import { Pencil, Trash2 } from "lucide-react";
import { deleteAuction } from "../../api/auctions.api";
import { useState } from "react";
import EditAuctionForm from "./EditAuctionFormModal";

type Props = {
  auction: Auction;
};

function AuctionCard({ auction }: Props) {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const imageUrl =
    auction.images.length > 0 ? auction.images[0].imageUrl : null;

  const isOwner = user?.id === auction.owner.id;
  const isActive = auction.status === "active";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this auction?")) {
      try {
        await deleteAuction(auction.id);
      } catch (error) {

        console.error(error);
        alert("Failed to delete auction");
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div
        className="
          group
          bg-white
          rounded-3xl
          overflow-hidden
          border border-[#3B0F19]/15
          transition
          hover:shadow-xl
          hover:-translate-y-1
          flex flex-col
          h-full
        "
      >
        {/* IMAGE */}
        <div className="relative h-48 bg-[#F6F2F0] flex items-center justify-center shrink-0">
          {imageUrl ? (
            <img
              src={`${API_BASE_URL}/uploads/${imageUrl}`}
              alt={auction.title}
              className="object-contain w-full h-full p-4 transition rounded-2xl group-hover:scale-105 "
            />
          ) : (
            <span className="text-sm text-[#7A2E3A]">No image</span>
          )}

          {/* BUY NOW BADGE */}
          {auction.buyNowPrice && auction.status === "active" && (
            <div className="absolute top-3 right-3 bg-[#E6C76E] text-[#3B0F19] text-xs font-semibold px-3 py-1 rounded-full shadow">
              Buy now €{auction.buyNowPrice}
            </div>
          )}

        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-grow gap-2 p-4">
          {/* TITLE */}
          <h2 className="text-base font-semibold text-[#3B0F19] line-clamp-2">
            {auction.title}
          </h2>

          {/* PRICE */}
          <div className="flex items-baseline justify-between mt-auto">
            <p className="text-sm text-[#5A1D2B]">Current bid</p>
            <p className="text-lg font-bold text-[#3B0F19]">
              €{auction.currentPrice}
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-[#3B0F19]/10 my-1" />

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#7A2E3A]">
              Ends {new Date(auction.endDate).toLocaleString()}
            </p>

            {isOwner && isActive && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit auction"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete auction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditAuctionForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        auction={auction}
      />

    </>
  );
}

export default AuctionCard;