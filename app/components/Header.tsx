"use client";
import { ConnectButton } from "thirdweb/react";
import Link from "next/link";
import Image from "next/image";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient, getContract } from "thirdweb";
import { useState } from "react";
import { size } from "viem";
import { sepolia } from "thirdweb/chains";
import { sep } from "path";
const client = createThirdwebClient({
  clientId: "19384c95c09239d3ea2a87a48b6bdcc5",
});
if (!process.env.NEXT_PUBLIC_NFT_MARKET_CONTRACT_ADDR) {
  throw new Error("NEXT_PUBLIC_NFT_MARKET_CONTRACT_ADDR is not defined");
}

if (!process.env.NEXT_PUBLIC_BASIC_NFT_CONTRACT_ADDR) {
  throw new Error("NEXT_PUBLIC_BASIC_NFT_CONTRACT_ADDR is not defined");
}

export const marketContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: sepolia,
  // the contract's address
  address: process.env.NEXT_PUBLIC_NFT_MARKET_CONTRACT_ADDR,
  // OPTIONAL: the contract's abi
});

export const nftContract = getContract({
  client,
  chain: sepolia,
  address: process.env.NEXT_PUBLIC_BASIC_NFT_CONTRACT_ADDR,
});

export default function Header() {
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];
  //client id 19384c95c09239d3ea2a87a48b6bdcc5
  //

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-lg dropdown-content text-xl mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link className="text-xl" href="/market">
                Marketplace
              </Link>
            </li>
            <li>
              <Link className="text-xl" href={"/mint"}>
                Creation
              </Link>
            </li>
            <li>
              <Link className="text-xl" href={"/collection"}>
                Collection
              </Link>
            </li>

            <li>
              <Link className="text-xl" href={"/balance"}>
                Balance
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          TombNFT
        </Link>
        <ul className="menu menu-horizontal px-1 gap-1 text-base hidden lg:flex ml-10">
          <li>
            <Link href={"/market"}>Marketplace</Link>
          </li>
          <li>
            <Link href={"/mint"}>Creation</Link>
          </li>
          <li>
            <Link href={"/collection"}>Collection</Link>
          </li>
          <li>
            <Link href={"/balance"}>Balance</Link>
          </li>
          {/* <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li> */}
        </ul>
      </div>

      <div className="navbar-end lg:flex">
        <ConnectButton client={client} wallets={wallets} />
      </div>
    </div>
  );
}
