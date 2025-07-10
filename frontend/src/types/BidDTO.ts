// src/types/BidDTO.ts

export interface BidderDTO {
  id: string;
  name: string;
  avatar: string;
  isActive?: boolean;
}

export interface BidDTO {
  id: string;
  auctionId: string;
  amount: number;
  bidTime: string; // or Date, depending on your backend
  bidder: BidderDTO;
}
