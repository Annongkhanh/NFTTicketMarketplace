// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721, ERC721URIStorage, Ownable {
    address public marketContract;

    function setMarketContractAddress(address _addr) public onlyOwner{
        require(_addr != address(0),"Cannot set market contract address to address 0");
        marketContract = _addr;
    }

    constructor(address _addr) ERC721("Ticket", "TICKET") {
        setMarketContractAddress(_addr);
    }
    modifier onlyMarketContract() {
        require(
            msg.sender == marketContract || msg.sender == owner(),
            "Only market contract or owner can call"
        );
        _;
    } 

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyMarketContract
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal onlyMarketContract override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal onlyMarketContract override(ERC721) {
        super._transfer(from, to, tokenId);
    }

    function burn(uint256 tokenId) public virtual {
        
        _burn(tokenId);
    }

}