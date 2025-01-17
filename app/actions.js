"use server";

import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

let options = undefined;
if (process.env.https_proxy) {
  options = {
    httpAgent: new HttpsProxyAgent(process.env.https_proxy),
  };
}
const openai = new OpenAI(options);

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export async function genNftWithAI(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a SVG image creator. Every time users will give you descriptions about a tombstone they want to build. You can only response with uncommented SVG code in JSX format, drawing tombstone with 384px of width and height based on users description.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o",
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

export async function uploadNftToStorage(nft) {
  console.log(JSON.stringify(nft));
  const upload = await storage.upload(JSON.stringify(nft));
  const uri = storage.resolveScheme(upload);
  console.log(`Gateway URL - ${uri}`);

  const data = await storage.downloadJSON(uri);
  console.log("data", data);
  console.log(data["svg"]);
  return uri;
}

export async function getNftFromStorage(uri) {
  let data = "";
  try {
    data = await storage.downloadJSON(uri);
  } catch (error) {
    console.error(error);
  }
  return data;
}
