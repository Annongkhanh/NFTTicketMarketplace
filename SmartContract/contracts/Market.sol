// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./Token.sol";

contract Market is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {

    address public tokenAddress;
    uint256 internal idEvent;
    uint256 internal openEvent;
    uint256 internal idCounter;
    mapping(address => bool) organizer;
    mapping(address => bool) blacklist;
    mapping(address => uint256) organizerEvent;

    struct Event{
        uint256 id;
        address organizer;
        uint256 ticketPrice;
        uint256 ticketRemain;
        uint256 revenue;
        bool isClosed;
        string uri;
        string name;
        string description;
    }

    mapping(uint256 => Event) idToEvent;

    function setOrganizer(address to, bool value) public onlyOwner returns(bool _value){
        organizer[to] = value;
        emit setOrganizerEvent(to, value);
        return value;
    }   

    // function fetchEvent() public view returns (Event[] memory){
    //     uint256 count = 0;
    //     Event[] memory events = new Event[](openEvent);
    //     for (uint256 i = 1; i <= idEvent; i++){
    //         if (idToEvent[i].isClosed == false && idToEvent[i].ticketRemain > 0){
    //             Event storage currentEvent = idToEvent[i];
    //             events[count] = currentEvent;
    //             count += 1;
    //         }
    //     }
    //     return events;
    // }

    // function fetchEventOrganizer(address _addr) public view returns (Event[] memory){
    //     uint256 count = 0;
    //     Event[] memory events = new Event[](organizerEvent[_addr]);
    //     for (uint256 i = 1; i <= idEvent; i++){
    //         if (idToEvent[i].organizer == _addr && (idToEvent[i].isClosed == false || idToEvent[i].revenue > 0)){
    //             Event storage currentEvent = idToEvent[i];
    //             events[count] = currentEvent;
    //             count += 1;
    //         }
    //     }
    //     return events;
    // }

    function getTicketRemain(uint256 id) public view returns (uint256 ticketRemain){
        return idToEvent[id].ticketRemain;
    }

    function getRevenue(uint256 id) public view returns (uint256 revenue){
        return idToEvent[id].revenue;
    }
    
    function claimRevenue(uint256 id) public payable{
        require(idToEvent[id].isClosed == true, "Event is not ended");
        require(idToEvent[id].organizer == msg.sender, "You can not claim revenue of other organizers");
        payable(msg.sender).transfer(idToEvent[id].revenue);
        idToEvent[id].revenue = 0;
        organizerEvent[msg.sender] --;
        emit claimRevenueEvent(id);

    } 
    function closeEvent(uint256 id) public onlyOrganizer {
        require(idToEvent[id].organizer == msg.sender, "You are not the organizer of the event");
        idToEvent[id].isClosed = true;
        openEvent --;
    }

    modifier notBlacklisted(){
        require(!blacklist[msg.sender], "You are blocked");
        _;
    }

    modifier onlyOrganizer() {
        require(
            organizer[msg.sender] == true || owner() == msg.sender,
            "You are not an organizer!"
        );
        _;
    }


    event claimRevenueEvent(uint256 indexed id);
    event setOrganizerEvent(address indexed to, bool value);
    
    event createEventEvent(
        uint256 indexed id,
        address organizer,
        uint256 ticketPrice,
        uint256 ticketRemain,
        bool isClosed,
        string uri,
        string name,
        string description
    );

    event sellTicketEvent(
        uint256 indexed id,
        uint256 ticketRemain,
        address buyer,
        uint256 revenue
    );

    event returnTicketEvent(
        uint256 indexed id,
        uint256 ticketRemain,
        address receiver,
        uint256 revenue
    );

    // event useTicketEvent(uint256 id,uint256 number, address receiver);
    function createEvent(
        uint256 price,
        uint256 totalTicket,
        string memory eventUri,
        string memory name,
        string memory description
    ) public onlyOrganizer notBlacklisted {   
        idEvent ++;     
        // Token(tokenAddress).mint(msg.sender, idEvent, totalTicket, "");
        idToEvent[idEvent] = Event(
            idEvent,
            msg.sender,
            price,
            totalTicket,
            0,
            false,
            eventUri,
            name,
            description
        );
        openEvent ++;
        organizerEvent[msg.sender] ++;
        emit createEventEvent(idEvent, msg.sender, price, totalTicket, false, eventUri, name, description);
    }

    function buyTicket(uint256 id) notBlacklisted public payable {
        require(!idToEvent[id].isClosed, "Event closed");
        require(idToEvent[id].ticketRemain >= 1, "Not enough tickets");
        require(msg.value == idToEvent[id].ticketPrice, "Sent value is not equal to the total price");
        idToEvent[id].revenue += msg.value;
        idToEvent[id].ticketRemain -= 1;
        idCounter++;
        Token(tokenAddress).safeMint(msg.sender, idCounter, idToEvent[id].uri);
        
        emit sellTicketEvent(id, idToEvent[id].ticketRemain, msg.sender, idToEvent[id].revenue);
    }

    function returnTicket(uint256 id, uint256 tokenId) public payable notBlacklisted{
        require(!idToEvent[id].isClosed, "Event closed");
        require(Token(tokenAddress).ownerOf(tokenId) == msg.sender, "You cannot return tickets that you do not have");
        Token(tokenAddress).burn(tokenId);
        payable(msg.sender).transfer(idToEvent[id].ticketPrice * 70 / 100);
        idToEvent[id].revenue -= idToEvent[id].ticketPrice * 70 / 100;
        idToEvent[id].ticketRemain += 1;
        emit returnTicketEvent(id, idToEvent[id].ticketRemain, msg.sender, idToEvent[id].revenue);
    }

    // function useTicket(uint256 id, uint256 number) public payable notBlacklisted{
    //     require(!idToEvent[id].isClosed, "Event closed");
    //     require(Token(tokenAddress).balanceOf(msg.sender, id) >= number, "You cannot use tickets that are larger than the number of tickets you have ");
    //     Token(tokenAddress).burn(msg.sender, id, number);
    //     emit useTicketEvent(id, number, msg.sender);
    // }
    
    function setTokenAddress(address _addr) public onlyOwner {
        tokenAddress = _addr;
    }


    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        idCounter = 1;
    }
   
    function _authorizeUpgrade(address) internal override onlyOwner {}

}
