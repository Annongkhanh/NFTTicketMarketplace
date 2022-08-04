export const networkConfigs = {
    "0x38": {
        chainId: 56,
        chainName: "Binance Smart Chain",
        currencyName: "BNB",
        currencySymbol: "BNB",
        rpcUrl: "https://bsc-dataseed.binance.org/",
        blockExplorerUrl: "https://bscscan.com/",
        wrapped: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    "0x61": {
        chainId: 97,
        chainName: "Binance Smart Chain Testnet",
        currencyName: "BNB",
        currencySymbol: "BNB",
        rpcUrl: "https://data-seed-prebsc-2-s1.binance.org:8545/",
        blockExplorerUrl: "https://testnet.bscscan.com/",
    },

};

export const getNativeByChain = (chain) =>
    networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
    networkConfigs[chain]?.wrapped || null;