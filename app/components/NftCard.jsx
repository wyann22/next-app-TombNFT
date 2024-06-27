"use client";
import { nftContract, marketContract } from "@/app/components/Header";
import { useState, useEffect } from "react";
import { getNftFromStorage } from "/app/actions";
import {
  useReadContract,
  useActiveAccount,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import JsxParser from "jsx-parser-react";
import {
  sendAndConfirmTransaction,
  prepareContractCall,
  toEther,
  toWei,
} from "thirdweb";
import NftSkeleton from "./Skeleton";
import Modal from "./Modal";
// import { useRouter } from "next/navigation";
// import { revalidatePath } from "next/cache";
function ipfsUriToUrl(ipfsUri) {
  return ipfsUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
}

export default function NftListedCard({ tokenId, owner, price }) {
  const activeAccount = useActiveAccount();
  console.log(activeAccount);
  console.log(owner);
  // read the tokenURI from the contract
  const { data: tokenURI, isLoading } = useReadContract({
    contract: nftContract,
    method: "function tokenURI(uint256 tokenId) returns (string)",
    params: [BigInt(tokenId)],
  });

  // fetch tokenURL from URI
  const [tokenJson, setTokenJson] = useState(null);
  // useEffect(() => {
  //   const fetchTokenUrl = async () => {
  //     if (tokenURI) {
  //       const response = await fetch(ipfsUriToUrl(tokenURI));
  //       const data = await response.json();
  //       setTokenJson(data);
  //     }
  //   };
  //   fetchTokenUrl();
  // }, [tokenURI]);
  // console.log(tokenJson);
  useEffect(() => {
    const fetchImage = async () => {
      if (tokenURI) {
        setTokenJson(await getNftFromStorage(tokenURI));
      }
    };
    fetchImage();
  }, [tokenURI]);

  // click to buy event
  const [bought, setBought] = useState(false);
  const { mutate: sendAndConfirmTx, data: transactionReceipt } =
    useSendAndConfirmTransaction();
  const buyNft = async () => {
    const transaction = prepareContractCall({
      contract: marketContract,
      method: "function buyNft(address _nftAddress, uint256 _tokenId)",
      params: [nftContract.address, tokenId],
      value: BigInt(price),
    });
    setBought(true);
    sendAndConfirmTx(transaction);
  };

  if (isLoading || !tokenJson) {
    return <NftSkeleton />;
  }
  console.log("bought:", bought);
  return (
    (bought &&
      transactionReceipt &&
      transactionReceipt.status == "success") || (
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <JsxParser jsx={tokenJson["svg"]} />
        </figure>
        <div className="card-body">
          <p className="prose"> {tokenJson["name"]}</p>
          <div className="card-actions flex justify-end items-center gap-5">
            <div className="card-title flex ">{toEther(BigInt(price))} ETH</div>
            {activeAccount &&
            activeAccount.address.toLowerCase() !== owner.toLowerCase() ? (
              bought ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <button
                  className="btn btn-outline text-white bg-black btn-small btn-wide rounded-sm btn-small btn-ghost hover:bg-white hover:text-black"
                  onClick={buyNft}
                >
                  BUY
                </button>
              )
            ) : activeAccount ? (
              <p className="text-right text-pretty text-gray-600">
                You are Owner
              </p>
            ) : (
              <p className="text-right text-pretty text-gray-600">
                Connect Wallet to Buy
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export function NftCollectionCard({ tokenId, owner, price, listed }) {
  const activeAccount = useActiveAccount();
  console.log(activeAccount);
  // read the tokenURI from the contract
  const { data: tokenURI, isLoading } = useReadContract({
    contract: nftContract,
    method: "function tokenURI(uint256 tokenId) returns (string)",
    params: [BigInt(tokenId)],
  });
  // fetch tokenURL from URI
  const [tokenJson, setTokenJson] = useState(null);
  console.log(tokenURI);
  useEffect(() => {
    console.log(tokenURI);

    const fetchImage = async () => {
      if (tokenURI && tokenURI != "undo") {
        setTokenJson(await getNftFromStorage(tokenURI));
      }
    };
    fetchImage();
  }, [tokenURI]);
  console.log(tokenJson);

  // click to sell event
  //const [listing, setListing] = useState(false);
  const [_listed, setListed] = useState(listed ? "listed" : "unlisted");
  const [_price, setPrice] = useState(toEther(BigInt(price)));
  const [soldPrice, setSoldPrice] = useState("0");
  // list nft for sale
  const sellNft = async () => {
    setListed("listing");
    const approved_trans = prepareContractCall({
      contract: nftContract,
      method: "function approve(address to, uint256 tokenId)",
      params: [marketContract.address, tokenId],
    });
    const list_trans = prepareContractCall({
      contract: marketContract,
      method:
        "function listNft(address _nftAddress, uint256 _tokenId, uint256 _price)",
      params: [nftContract.address, tokenId, toWei(soldPrice)],
    });

    const approve_rec = await sendAndConfirmTransaction({
      account: activeAccount,
      transaction: approved_trans,
    });

    if (approve_rec.status == "success") {
      try {
        const receipt = await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: list_trans,
        });
        if (receipt.status == "success") {
          setListed("listed");
          setPrice(soldPrice);
        } else {
          console.error("transaction reverted");
        }
      } catch (e) {
        console.log(nftContract.address, tokenId, toWei(soldPrice));
        console.error("sellNft trans error:", e);
      }
    }
  };

  // cancel list
  const [cancaling, setCanceling] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const cancelListing = async () => {
    setCanceling(true);
    const cancel_trans = prepareContractCall({
      contract: marketContract,
      method: "function cancelListNft(address _nftAddress, uint256 _tokenId)",
      params: [nftContract.address, tokenId],
    });
    const cancel_rec = await sendAndConfirmTransaction({
      account: activeAccount,
      transaction: cancel_trans,
    });
    if (cancel_rec.status == "success") {
      setCanceling(false);
      setCanceled(true);
      setListed("unlisted");
    } else {
      console.error("transaction reverted");
    }
  };
  const isListing = _listed == "listing";
  const isListed = _listed == "listed";
  console.log("tokenid:", tokenId, _listed, listed);

  if (isLoading || !tokenJson) {
    return <NftSkeleton />;
  }
  const listModalId = "price_modal" + tokenId;
  if (isListing) {
    const modal = document.getElementById(listModalId);
    if (modal) {
      modal.close();
    }
  }
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <JsxParser jsx={tokenJson["svg"]} />
      </figure>
      <div className="card-body">
        <p className="prose">
          {" "}
          {tokenJson["name"]} {tokenId}
        </p>
        {isListed ? (
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start">
              <p className="prose pr-1">Price:</p>
              <div className="card-title flex">{_price} ETH</div>
            </div>
            <div className="badge badge-neutral badge-sm rounded-sm"> Sale</div>
          </div>
        ) : null}

        <div className="card-actions flex justify-between items-center ">
          <div className="flex justify-end w-full">
            {isListed ? (
              cancaling ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <button
                  className="btn btn-outline btn-small btn-wide rounded-sm btn-small btn-ghost hover:bg-black"
                  onClick={cancelListing}
                >
                  CANCEL
                </button>
              )
            ) : (
              <button
                className="btn btn-outline text-white bg-black btn-small btn-wide rounded-sm btn-small btn-ghost hover:bg-white hover:text-black"
                onClick={() => document.getElementById(listModalId).showModal()}
              >
                SELL
              </button>
            )}
            <Modal id={listModalId} canClose={true}>
              <div className="flex flex-col content-center">
                <h3 className="text-2xl font-bold mb-6">
                  Sell your TOMB in marketplace
                </h3>
                <label className="input input-bordered flex items-center gap-2">
                  Price:
                  <input
                    type="text"
                    className="grow"
                    placeholder="0.001"
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                  />
                  ETH
                </label>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline prose-invert btn-ghost hover:bg-black"
                  onClick={sellNft}
                >
                  SUBMIT
                </button>
                <form
                  id="listNft"
                  method="dialog"
                  className="flex flex-row gap-3"
                >
                  {/* if there is a button in form, it will close the modal */}

                  <button className="btn btn-outline btn-error">CANCEL</button>
                </form>
              </div>
            </Modal>
            {isListing ? (
              <Modal show={true}>
                <div className="flex flex-row justify-start items-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <h3 className="font-bold text-lg ps-3">
                    2 Transactions Processing ...
                  </h3>
                </div>
              </Modal>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}