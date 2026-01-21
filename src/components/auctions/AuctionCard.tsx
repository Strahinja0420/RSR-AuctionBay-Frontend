import { API_BASE_URL } from "../../api/axios";
import type { Auction } from "../../types/Auction.type";

type Props = {
  auction: Auction;
};

function AuctionCard({ auction }: Props) {
  const imageUrl =
    auction.images.length > 0 ? auction.images[0].imageUrl : null;

    //console.log(auction);
    

  return (
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
      "
    >
      {/* IMAGE */}
      <div className="relative h-48 bg-[#F6F2F0] flex items-center justify-center">
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
        {auction.buyNowPrice && (
          <div className="absolute top-3 right-3 bg-[#E6C76E] text-[#3B0F19] text-xs font-semibold px-3 py-1 rounded-full shadow">
            Buy now €{auction.buyNowPrice}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-2 p-4">
        {/* TITLE */}
        <h2 className="text-base font-semibold text-[#3B0F19] line-clamp-2">
          {auction.title}
        </h2>

        {/* PRICE */}
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-[#5A1D2B]">Current bid</p>
          <p className="text-lg font-bold text-[#3B0F19]">
            €
            {auction.currentPrice}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-[#3B0F19]/10 my-1" />

        {/* FOOTER */}
        <p className="text-xs text-[#7A2E3A]">
          Ends {new Date(auction.endDate).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default AuctionCard;
