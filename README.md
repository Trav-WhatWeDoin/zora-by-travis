# Zora by Travis

**Zora by Travis** is a unified NFT minting platform that allows users to mint NFTs through the web or a selected social media platform (Telegram, Discord, or Twitter). The web version includes advanced features like image generation by combining two Zora coins.

---

## 🚀 What It Does

- Mint NFTs via one chosen social media platform (Telegram, Discord, or Twitter)
- Upload and preview files for minting via a modern web interface
- Generate new NFT images by merging traits from two Zora tokens (web-only feature)
- Store metadata securely and interact with the Zora protocol

---

## 🧩 Problem It Solves

Creating and minting NFTs from multiple channels (web or social) can be fragmented. This project streamlines NFT creation across platforms while providing enhanced tools on the web for creative control.

---

## 🧪 Technologies Used

- **Next.js** for the web frontend
- **Telegram Bot API** (or Discord/Twitter) for social integration
- **Zora Protocol** for NFT minting
- **Hugging Face** for AI-generated image features
- **Node.js** and **TypeScript** for backend logic
- **Yarn Workspaces** for monorepo management
- **dotenv** for environment variable management

---

## 🏗️ How We Built It

This is a **monorepo** managed with Yarn Workspaces, structured like this:

> You can replace Telegram with Discord or Twitter depending on ease and available API functionality.

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/Trav-WhatWeDoin/zora-by-travis.git
cd zora-by-travis

# Install dependencies
yarn install

# Run telegram bot
cd packages/telegram-bot/

# Run web app
cd packages/web-app
yarn dev

# API keys

# packages/telegram-bot/.env

TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
HUGGINGFACE_API_TOKEN=your_hf_token_here
RPC_URL=your_rpc_url_here
WALLET_ADDRESS=your_wallet_address
PINATA_JWT=your_pinata_jwt_here
```
