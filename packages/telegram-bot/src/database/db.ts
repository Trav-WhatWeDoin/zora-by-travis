import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { MintedNFT } from "../types/nft";

// Ensure data directory exists
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize database
const dbPath = path.join(dataDir, "minted_nfts.db");
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS minted_nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id TEXT,
    image_url TEXT,
    caption TEXT,
    timestamp TEXT
  )
`);

export function insertMintedNFT(
  chatId: string,
  imageUrl: string,
  caption: string
) {
  const stmt = db.prepare(`
    INSERT INTO minted_nfts (chat_id, image_url, caption, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(chatId, imageUrl, caption, new Date().toISOString());
}

export function getAllMintedNFTs() {
  const stmt = db.prepare(`SELECT * FROM minted_nfts`);
  return stmt.all();
}

export function getUserNFTs(chatId: string): MintedNFT[] {
  const stmt = db.prepare(`
      SELECT * FROM minted_nfts WHERE chat_id = ?
    `);
  return stmt.all(chatId) as MintedNFT[];
}
