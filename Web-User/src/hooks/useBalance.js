import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useBalance = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId, tokenAddress } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);

  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTsForContract, { chain: chainId,token_address: tokenAddress, ...options });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      setFetchSuccess(true);
      for (let NFT of NFTs) {
        if (NFT?.token_uri) {
          try {
            await fetch(NFT.token_uri)
              .then((data) => {
                NFT.image = resolveLink(data);
              });
          } catch (error) {
            setFetchSuccess(false);
          }
        }
      }
      setNFTBalance(NFTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
