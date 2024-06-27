// @ts-nocheck
"use client";
import NftListedCard from "../../components/NftCard";
import { GET_LISTED_NFTS } from "../../lib/graph_query";
import { useQuery } from "@apollo/client";
import Modal from "../../components/Modal";
import { useEffect } from "react";
export default function Market() {
  const { loading, error, data } = useQuery(GET_LISTED_NFTS, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) {
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
      <Modal>
        <p className="py-4">`Error! ${error.message}`</p>
      </Modal>
    );

  console.log(data.nfts);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
      {data.nfts.map((nft, index) => (
        <NftListedCard
          key={nft.id}
          tokenId={nft.tokenId}
          owner={nft.owner}
          price={nft.price}
        />
      ))}
    </div>
  );
} // return {
//   image: tokenURI ? tokenURI : "",
//   name: nft.name,
//   desc: nft.desc,
//   price: nft.price,
//   isLoading: isLoading,
//   uri: nft.uri,
// };

// const listedNfts: ListedNFT[] = data.nfts;
// const nfts: Nft[] = listedNfts.map((nft: ListedNFT) => {
//   const {
//     data: tokenURI,
//     isLoading,
//   }: { data: string | undefined; isLoading: boolean } = useReadContract({
//     contract: nftContract,
//     method: "function tokenURI(uint256 tokenId) returns (string)",
//     params: [BigInt(nft.tokenId)],
//   });
//   console.log(tokenURI);
//   return "";
//   // return {
//   //   image: tokenURI ? tokenURI : "",
//   //   name: nft.name,
//   //   desc: nft.desc,
//   //   price: nft.price,
//   //   isLoading: isLoading,
//   //   uri: nft.uri,
//   // };
// });
