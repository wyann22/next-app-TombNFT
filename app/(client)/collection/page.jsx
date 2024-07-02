"use client";
import { NftCollectionCard } from "../../components/NftCard";
import { GET_YOUR_NFTS } from "../../lib/graph_query";
import { useQuery } from "@apollo/client";
import Modal from "../../components/Modal";
import {
  useReadContract,
  useActiveAccount,
  useSendTransaction,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { useEffect } from "react";
import Alert from "@/app/components/Alert";
import { useQueryClient } from "@tanstack/react-query";
export default function Collection() {
  const activeAccount = useActiveAccount();
  const queryClient = useQueryClient();
  console.log(queryClient);
  const { loading, error, data, refetch } = useQuery(GET_YOUR_NFTS, {
    variables: {
      owner: activeAccount ? activeAccount.address : "",
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    if (data && activeAccount) {
      console.log("refetching");
      refetch();
    }
  }, []);

  if (loading)
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="skeleton h-screen w-full"></div>
      </div>
    );
  if (error)
    return (
      <Modal show={true}>
        <p className="py-4">`Error! ${error.message}`</p>
      </Modal>
    );
  if (!activeAccount) {
    return (
      <Alert>
        {" "}
        <div>Please connect your wallet to view your TOMB.</div>
      </Alert>
    );
  }
  const nfts = data.nfts;
  console.log(data.nfts);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
      {nfts.map((nft, index) => (
        <NftCollectionCard
          key={nft.id}
          tokenId={nft.tokenId}
          owner={activeAccount.address}
          price={nft.price}
          listed={nft.listed}
        />
      ))}
    </div>
  );

  if (!activeAccount) return "Please connect your wallet to view your NFTs.";
}
