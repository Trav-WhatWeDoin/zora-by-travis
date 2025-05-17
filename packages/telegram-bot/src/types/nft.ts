// src/types/nft.ts

export type MintedNFT = {
  id?: number; // Auto-incremented by SQLite
  chat_id: string;
  image_url: string;
  caption: string;
  timestamp: string;
};
