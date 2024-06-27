"use client";
import { genNftWithAI, uploadNftToStorage } from "/app/actions";
import { useEffect, useState } from "react";

import { nftContract } from "@/app/components/Header";
import JsxParser from "jsx-parser-react";
import {
  sendAndConfirmTransaction,
  prepareContractCall,
  toEther,
  toWei,
} from "thirdweb";
import Modal from "@/app/components/Modal";
import { useActiveAccount } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import Link from "next/link";
import Alert from "@/app/components/Alert";
export default function Mint() {
  function resetAllState() {
    setGenNft("undo");
    setUploadNft("undo");
    setMintNft("undo");
    setPrompt(defaultPrompt);
    setName(defaultName);
  }
  const activeAccount = useActiveAccount();
  const [genNft, setGenNft] = useState("undo");
  const [uploadNft, setUploadNft] = useState("undo");
  const [mintNft, setMintNft] = useState("undo");

  const defaultPrompt = "Randomly styled tombstone";
  const defaultName = "MYTOMB";

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [name, setName] = useState(defaultName);

  const handleGenNft = async () => {
    setGenNft("doing");
    const res = await genNftWithAI(prompt);
    setGenNft(res);
  };

  const uploadNftToIPFS = async () => {
    setUploadNft("doing");
    const nft = {
      name: name,
      desc: prompt,
      svg: removeFirstAndLastLines(genNft),
    };
    const uri = await uploadNftToStorage(nft);
    setUploadNft(uri);
    return uri;
  };

  const mintNftTrans = async (uri) => {
    setMintNft("doing");
    const trans = prepareContractCall({
      contract: nftContract,
      method: "function mintNft(string tokenUri)",
      params: [uri],
    });

    const rec = await sendAndConfirmTransaction({
      account: activeAccount,
      transaction: trans,
    });

    if (rec && rec.status == "success") {
      setMintNft("success");
    } else {
      setMintNft("processing mintNft transacion failed");
    }
  };
  const handleMintNft = async () => {
    uploadNftToIPFS().then((uri) => {
      mintNftTrans(uri);
    });
  };

  function removeFirstAndLastLines(str) {
    if (str.startsWith("```")) {
      let lines = str.split("\n");
      lines.shift(); // Remove the first line
      lines.pop(); // Remove the last line
      return lines.join("\n");
    }
    return str;
  }
  console.log(removeFirstAndLastLines(genNft));

  const genNftLoading = genNft == "doing";
  const genNftDone = genNft != "doing" && genNft != "undo";
  const genNftUndo = genNft == "undo";
  console.log("done:", genNftDone);
  const uploadNftLoading = uploadNft == "doing";
  const uploadNftDone = uploadNft != "doing" && uploadNft != "undo";
  const uploadNftUndo = uploadNft == "undo";

  const mintNftLoading = mintNft == "doing";
  const mintNftDone = mintNft == "success";
  const mintNftUndo = mintNft == "undo";
  const mintNftError =
    mintNft != "undo" && mintNft != "doing" && mintNft != "success";

  if (!activeAccount) {
    return (
      <Alert>
        {" "}
        <div>Please connect your wallet to create TOMB.</div>
      </Alert>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-1 items-center justify-center flex flex-col lg:flex-row-reverse gap-5">
        {}
        {genNftDone && <JsxParser jsx={removeFirstAndLastLines(genNft)} />}
        {genNftLoading && <div className="skeleton w-96 h-96 w"></div>}
        {genNftUndo && (
          <div className=" text-gray-400 flex items-center justify-center border border-black w-96 h-96">
            {"TOMBSTONE SVG WILL BE GENERATED HERE"}
          </div>
        )}

        <label className="form-control max-w-lg w-full gap-2">
          <div>
            <div className="label w-fit">
              <span className="label-text">
                Describe what your TOMB is like
              </span>
            </div>
            <textarea
              placeholder={defaultPrompt}
              className="textarea textarea-bordered textarea-lg w-full max-w-lg"
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="btn btn-sm btn-outline rounded-sm"
                disabled={genNftLoading ? "disabled" : ""}
                onClick={handleGenNft}
              >
                Generate Image<span className="arrow"></span>
              </button>
            </div>
          </div>
          <div>
            <div className="label w-fit">
              <span className="label-text">Name of your TOMB</span>
            </div>
            <input
              type="text"
              placeholder="MYTOMB"
              className="input input-bordered input-lg w-full"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleMintNft}
              disabled={
                !genNftDone || mintNftLoading || uploadNftLoading
                  ? "disabled"
                  : ""
              }
              className="btn btn-outline btn-small rounded-sm btn-ghost hover:bg-black"
            >
              Create TOMB
            </button>
          </div>
        </label>
      </div>
      {(uploadNftLoading || mintNftLoading || mintNftError) && (
        <Modal id="mint" show={true}>
          <div className="flex flex-row justify-start items-center">
            <span className="loading loading-spinner loading-lg"></span>
            <h3 className="font-bold text-lg ps-3">
              {mintNftLoading && "1 transaction processing ..."}
              {uploadNftLoading && "Uploading NFT to IPFS ..."}
              {mintNftError && "Minting NFT failed: " + mintNft}
            </h3>
          </div>
        </Modal>
      )}

      {mintNftDone && (
        <Modal id="mintDone" show={true} canClose={false}>
          <div className="flex flex-col justify-start items-center">
            <span className="ring-success"></span>
            <h3 className="font-bold text-lg ps-3">
              TOMB created successfully!
            </h3>
            <div className="modal-action">
              <Link href="/collection">
                <div className="btn btn-outline btn-sm rounded-sm hover:bg-black">
                  GO TO COLLECTION TO VIEW{" "}
                  <p className="text-lg font-bold">{name}</p>!
                </div>
              </Link>
              <button
                onClick={resetAllState}
                className="btn btn-outline btn-sm rounded-sm hover:bg-black"
              >
                CLOSE
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
