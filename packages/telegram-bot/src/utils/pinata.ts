import dotenv from "dotenv";

dotenv.config();

const pinataJWT = process.env.PINATA_JWT;

export async function pinFileWithPinata(file: File) {
  const data = new FormData();
  data.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJWT}`,
    },
    body: data,
  });

  const result = (await res.json()) as { IpfsHash: string };

  return `ipfs://${result.IpfsHash}`;
}

export async function pinJsonWithPinata(json: object) {
  const data = JSON.stringify({
    pinataContent: json,
    pinataMetadata: {
      name: "metadata.json",
    },
  });

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pinataJWT}`,
    },
    body: data,
  });

  const result = (await res.json()) as { IpfsHash: string };

  return `ipfs://${result.IpfsHash}`;
}
