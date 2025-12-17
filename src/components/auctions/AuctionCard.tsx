import { API_BASE_URL } from "../../api/axios";
import type { Auction } from "../../types/Auction.type";

type Props = {
  auction: Auction;
};

function AuctionCard({ auction }: Props) {
    let imageUrl;
    if (auction.images.length > 0) {
        imageUrl = auction.images[0].imageUrl;
    }

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition"
    >
      {auction.images.length > 0 && (
        <div className="h-40">
            <img
          src={`${API_BASE_URL}/uploads/${auction.images[0].imageUrl}`}
          alt={auction.title}
          className=" max-h-full max-w-full w-full object-contain rounded-[30px] mb-3"
        />
        </div>
      )}

      <h2 className="text-lg font-semibold">{auction.title}</h2>

      <p className="text-sm text-gray-500">
        Current price: €{auction.currentPrice}
      </p>

      {auction.buyNowPrice && (
        <p className="text-sm text-green-600">
          Buy now: €{auction.buyNowPrice}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Ends: {new Date(auction.endDate).toLocaleString()}
      </p>
    </div>
  );
}

export default AuctionCard;
