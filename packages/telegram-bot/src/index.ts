import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { insertMintedNFT, getUserNFTs } from "./database/db";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
import { NFTStorage, File } from "nft.storage";
import { createCoin } from "@zoralabs/coins-sdk";
import { pinFileWithPinata, pinJsonWithPinata } from "./utils/pinata";
import { makeImageTokenMetadata } from "./utils/metadata";
import {
  Hex,
  createWalletClient,
  createPublicClient,
  http,
  Address,
} from "viem";
import { base } from "viem/chains";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const hfToken = process.env.HUGGINGFACE_API_TOKEN;
const nftKey = process.env.NFT_STORAGE_API_KEY;
const rpcURL = process.env.RPC_URL;
const walletAddress = process.env.WALLET_ADDRESS;

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http(rpcURL),
});

const walletClient = createWalletClient({
  account: walletAddress as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined in .env");
}
if (!hfToken) {
  throw new Error("HUGGINGFACE_API_TOKEN is not defined in .env");
}

const hf = new InferenceClient(hfToken);

console.log("Starting bot...");

const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Start the bot" },
  { command: "/mynfts", description: "Check out your minted NFTs" },
]);

bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("Received /start from:", chatId);
  bot.sendMessage(
    chatId,
    "👋 Welcome to the NFT Minter Bot!\nSend me an image and caption to mint your NFT."
  );
});

bot.onText(/\/mynfts/, async (msg) => {
  const chatId = String(msg.chat.id);
  const records = getUserNFTs(chatId);

  if (records.length === 0) {
    bot.sendMessage(chatId, "You haven't minted any NFTs yet.");
    return;
  }

  for (const nft of records) {
    try {
      const response = await axios.get(nft.image_url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      await bot.sendPhoto(chatId, buffer, {
        caption: `📝 ${nft.caption}\n⏱ ${nft.timestamp}`,
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error sending photo:", err.message);
      bot.sendMessage(chatId, "There was an error retrieving your NFT image.");
    }
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const caption = msg.caption || "No caption";
  const photos = msg.photo;

  if (!photos || photos.length === 0) {
    return bot.sendMessage(chatId, "❌ Could not get the image.");
  }

  const fileId = photos[photos.length - 1].file_id;

  try {
    const file = await bot.getFile(fileId);
    const imageUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    console.log("Minting Image URL:", imageUrl);
    console.log("Caption:", caption);

    // Download the original image to use as the NFT
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    try {
      // Try to generate an image, but don't fail the whole process if this specific part fails
      console.log("Generating image with Hugging Face...");

      // Use a more reliable model or catch the error gracefully
      const generatedImage = await hf
        .textToImage(
          {
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: caption,
          },
          { outputType: "blob" }
        )
        .catch((error) => {
          console.log(
            "Image generation failed, will use original image:",
            error
          );
          return null;
        });
      // Convert a buffer to a File object
      function bufferToFile(
        buffer: Buffer,
        filename: string,
        mimeType: string
      ): File {
        return new File([buffer], filename, { type: mimeType });
      }

      // hf.imageToImage()
      const imageFile = bufferToFile(imageBuffer, "image.png", "image/png");

      const mediaFileIpfsUrl = await pinFileWithPinata(imageFile);
      console.log(mediaFileIpfsUrl);

      const jsonMetaData = await makeImageTokenMetadata({
        imageFile,
        thumbnailFile: imageFile,
      });

      // Define coin parameters
      const coinParams = {
        name: "My Awesome Coin",
        symbol: "MAC",
        uri: jsonMetaData,
        payoutRecipient: walletAddress as Address,
        // platformReferrer: "0xOptionalPlatformReferrerAddress" as Address, // Optional
        // initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
      };

      try {
        const result = await createCoin(coinParams, walletClient, publicClient);

        console.log("Transaction hash:", result.hash);
        console.log("Coin address:", result.address);
        console.log("Deployment details:", result.deployment);
      } catch (error) {
        console.error("Error creating coin:", error);
        throw error;
      }

      // If we successfully generated an image, send it
      if (generatedImage) {
        // Convert Blob to a Buffer for Telegram's sendPhoto
        const arrayBuffer = await generatedImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await bot.sendPhoto(chatId, buffer as any, {
          caption: `🎨 Generated from caption: ${caption}`,
        });
      }
    } catch (genError) {
      console.log(
        "Error during image generation (continuing with original):",
        genError
      );
      // We'll continue even if generation fails
    }

    // Always mint the NFT with the original image
    insertMintedNFT(String(chatId), imageUrl, caption);

    await bot.sendMessage(
      chatId,
      `🪄 NFT Minted Successfully!\n📝 Caption: ${caption}`
    );

    // Send the original image as the NFT
    await bot.sendPhoto(chatId, imageBuffer, {
      caption: `✅ Your NFT has been minted with this image and caption: "${caption}"`,
    });
  } catch (err) {
    console.error("Error processing photo:", err);
    if (err instanceof Error) {
      console.error("Error details:", err.message);
      console.error("Stack:", err.stack);
    } else {
      console.error("Unknown error type:", typeof err);
    }

    bot.sendMessage(
      chatId,
      "❌ Failed to process the image. Please try again later."
    );
  }
});
