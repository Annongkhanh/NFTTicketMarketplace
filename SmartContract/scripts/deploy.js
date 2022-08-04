const { ethers, upgrades } = require("hardhat");
require("dotenv").config();


async function main() {

    [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account: ", deployer.address);

    const Market = await ethers.getContractFactory("Market");
    const market = await upgrades.deployProxy(Market, { initializer: "initialize" }, { kind: 'uups' });
    await market.deployed();
    console.log(`Proxy: ${market.address}`);
    const Token = await ethers.getContractFactory("Token");

    //Write baseURI here
    const token = await Token.deploy(market.address);
    await token.deployed();

    console.log(`Token: ${token.address}`);


    const setTokenAddress = await market.setTokenAddress(token.address);
    await setTokenAddress.wait();

    console.log(`Check after deployment`);
    console.log(`Token: ${await market.tokenAddress()}`);
}

main().then(async() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exit(1);
})