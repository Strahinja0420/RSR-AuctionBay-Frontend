export type Bid = {
  id: number;
  amount: number;
  createdAt: string;

  placedById: string;
  auctionId: string;

  user?: {
    id: string;
    username: string;
  };
};
