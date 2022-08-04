require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();

const fs = require('fs');
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.7",
    networks: {
        bscMainnet: {
            url: process.env.BSCMAINNET_RPC,
            accounts: [process.env.PRIVATE_KEY],
        },
        bscTestnet: {
            url: process.env.BSCTESTNET_RPC,
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 11000000000,
        }
    },
    etherscan: {
        apiKey: process.env.BSCSCAN_API
    }
};