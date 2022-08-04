import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import abi from "./abi.json";

function MoralisDappProvider({ children }) {
    const { web3, Moralis, user } = useMoralis();
    const [walletAddress, setWalletAddress] = useState();
    const [chainId, setChainId] = useState();
    const [contractABI, setContractABI] = useState(JSON.stringify(abi)); //Smart Contract ABI here
    const [marketAddress, setMarketAddress] = useState("0x68423d7253c692F290D4D9067858Cd0272908b6B"); //Smart Contract Address Here
    const [tokenAddress, setTokenAddress] = useState("0x2AE7D5C2a06865974F123800896DBFa4A1eBE86e"); //Smart Contract Address Here



    useEffect(() => {
        Moralis.onChainChanged(function(chain) {
            setChainId(chain);
        });

        Moralis.onAccountsChanged(function(address) {
            setWalletAddress(address[0]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setChainId(web3.givenProvider?.chainId));
    useEffect(
        () => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")), [web3, user]
    );

    return ( <MoralisDappContext.Provider value = {
            { walletAddress, chainId, marketAddress, setMarketAddress, contractABI, setContractABI, tokenAddress, setTokenAddress }
        } > { children } </MoralisDappContext.Provider>
    );
}

function useMoralisDapp() {
    const context = React.useContext(MoralisDappContext);
    if (context === undefined) {
        throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
    }
    return context;
}

export { MoralisDappProvider, useMoralisDapp };