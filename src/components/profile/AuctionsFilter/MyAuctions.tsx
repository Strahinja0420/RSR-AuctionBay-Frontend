import { useAuction } from "../../../hooks/useAuctions";
import AuctionsGrid from "../../auctions/AuctionsGrid";

const MyAuctions = () => {
  const { userAuctions } = useAuction();

  //console.log(userAuctions);
  

  if (userAuctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-6 text-center">
        <p className="text-center text-[32px] font-bold text-(--text-primary)">
          Oh no, no auctions added!
        </p>
        <p className="text-center text-[16px] font-light text-(--text-gray)">
          To add a new auction click "+" button in <br />
          navigation bar and new auctions will be <br />
          added here.
        </p>
      </div>
    );
  }

  return <AuctionsGrid auctions={userAuctions} title="" onlyActive={false} />;
};

export default MyAuctions;
