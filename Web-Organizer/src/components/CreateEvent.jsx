import React, { useState } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";

import { BigNumber } from "bignumber.js";
import {Modal } from 'antd';




const styles = {
  label: {
    color:  "#1a9776",
    // position: "text-left",
    textalign: "left",
    fontsize: "100px",
    margintop: "30px",
    display: "block",
  }
};

function CreateEvent() {
  const { walletAddress, marketAddress } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [number, setPrice] = useState("");
  const [ticket, setTicket] = useState("");
  const contractProcessor = useWeb3ExecuteFunction();
  const [name, setName]  = useState("");
  const [des, setDes] = useState("");
  const [fileTarget, setFileTarget] = useState("");
 
  const fileInput = (e) => setFileTarget(e.target.files[0]);

  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Success`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `Error`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

async function createItem()  {
 if (!name.trim()){
    alert("Please enter the event name!");
    return;
}
if (!des.trim()){
  alert("Please enter the event description!");
  return;
}
  if (number.trim() <= 0 ) {
    alert("Please input the valid price!");
    return;
  }
  if (ticket.trim() <= 0 ) {
    alert("Please input the valid ticket number!");
    return;
  }
  if (!fileTarget){
    alert("Please upload the event image");
    return;
  }
  const isPNG = fileTarget.type === 'image/png';

  if (!isPNG) {
      alert(`${fileTarget.name} is not a png file`);
      return;
  }
  const nftFile = new Moralis.File("nftFile.jpg",fileTarget);
  await nftFile.saveIPFS();

  const nftFilePath = nftFile.ipfs();



  await contractCall();


async function contractCall(){
  const ops = {
    contractAddress: marketAddress,
    functionName: "createEvent",
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalTicket",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "eventUri",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "name": "createEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    params:{
      price: new BigNumber( number * ("1e"+18)).toString(),
      totalTicket: ticket,
      eventUri: nftFilePath,
      name: name,
      description: des
    }
  };

  await contractProcessor.fetch({
    params: ops,
    onSuccess: () => {
      console.log("success");
      succList();
    },
    onError: (error) => {
      console.log(ops);
      console.log(error);
      failList();
    },
  });
}
//   if (createItemFile.files.length == 0){
//     alert("Please select a file!");
//     return;
// } else

// }
 }

const createItemNameField = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById("txtCreateItemDescription");


// document.getElementById("btnCreateItem").onclick =  createItem;
//document.getElementById("btnCreateItem").onclick = NFTMarketTransactions;


  return (
    <>  
            <div class="modal-content bg-dark text-light">             
                
    
                    <div class="form-group">
                        <label style = {styles.label} >Event Name</label>
                        <input type="text" class="form-control" onChange={(e) => setName(e.target.value)} required placeholder="Enter event name"/>
                    </div>
    
                    <div class="form-group">
                        <label style = {styles.label} for="txtCreateItemDescription">Event Description</label>
                        <textarea class="form-control" id="txtCreateItemDescription"  cols="80" rows="15" onChange={(e) => setDes(e.target.value)} placeholder="Enter event description"></textarea>
                    </div>
                    <div class="form-group">
                        <label style = {styles.label} >Ticket Price</label>
                        <input type="number" min="0" step="0.001"  onChange={(e) => setPrice(e.target.value)} placeholder="Enter ticket price (BNB)" />
                    </div>
                    <div class="form-group">
                        <label style = {styles.label} >Total Ticket</label>
                        <input type="number" min="0" step="1" onChange={(e) => setTicket(e.target.value)} placeholder="Enter total ticket number" />
                    </div>


  <div>
  <label style = {styles.label} >Select event image file</label>
      <input type="file" onChange={fileInput} />
      
    </div>            
                
      <button onClick={() => createItem()} type="button" >Create!</button>
                
    </div>
            

    </>
  );
}

export default CreateEvent;
