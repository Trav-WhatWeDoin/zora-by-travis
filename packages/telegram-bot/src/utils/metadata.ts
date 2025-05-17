import { makeMediaTokenMetadata } from "@zoralabs/protocol-sdk";
import { pinFileWithPinata, pinJsonWithPinata } from "./pinata";

export async function makeImageTokenMetadata({
  imageFile,
  thumbnailFile,
}: {
  imageFile: File;
  thumbnailFile: File;
}) {
  // upload image and thumbnail to Pinata
  const mediaFileIpfsUrl = await pinFileWithPinata(imageFile);
  const thumbnailFileIpfsUrl = await pinFileWithPinata(thumbnailFile);

  console.log(mediaFileIpfsUrl, thumbnailFileIpfsUrl, typeof imageFile.name);

  // build token metadata json from the text and thumbnail file
  // ipfs urls
  const metadataJson = await makeMediaTokenMetadata({
    mediaUrl: mediaFileIpfsUrl,
    thumbnailUrl: thumbnailFileIpfsUrl,
    name: imageFile.name,
    description: "No description",
  });

  // ✅ Remove `animation_url` if it's null (to avoid Zora validation error)
  if (metadataJson.animation_url === null) {
    delete metadataJson.animation_url;
  }

  console.log(metadataJson);
  // upload token metadata json to Pinata and get ipfs uri
  const jsonMetadataUri = await pinJsonWithPinata(metadataJson);

  return jsonMetadataUri;
}
