import { gql } from "@apollo/client";

export const GET_LISTED_NFTS = gql`
  query GetListedNfts{
    nfts(orderBy: id, where: {listed: true}) {
        id
        nftAddress
        tokenId
        price
        owner
    }
  }`;

export const GET_YOUR_NFTS = gql`
  query GetYourNfts($owner: String!) {
    nfts(orderBy: id, where: { owner: $owner }) {
      id
      nftAddress
      tokenId
      price
      listed
    }
  }`;
