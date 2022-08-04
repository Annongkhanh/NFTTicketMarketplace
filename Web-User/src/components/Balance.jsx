import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card, Image, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { useBalance } from "hooks/useBalance";
import { QrcodeOutlined, ShoppingCartOutlined, InfoCircleOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import QRCode from 'qrcode.react';
const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

function Balance() {
  const { NFTBalance, fetchSuccess } = useBalance();
  const { chainId, marketAddress, contractABI, tokenAddress, walletAddress } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [visibleDes, setVisibilityDes] = useState(false);
  const [visibleQr, setVisibilityQr] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [nftDes, setNftDes] = useState(null);
  const [nftName, setNftName] = useState(null);
  const [qr, setQr] = useState(null);
  const [qrId, setQrId] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = contractABI;

  const queryMarketEvents = useMoralisQuery("createEvent",

  );

  const fetchMarketEvents = JSON.parse(
  JSON.stringify(queryMarketEvents.data, [
      "objectId",
      "createdAt",
      "uid",
      "ticketPrice",
      "ticketRemain",
      "organizer",
      "confirmed",
      "isClosed",
      "uri",
      "name",
      "description"
    ])
  );
  const getMarketItem = (nft) => {
    const result = fetchMarketEvents?.find(
      (e) =>
        e.uri === nft?.token_uri
    );
    return result;
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qrcode');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    console.log('pngUrl', pngUrl);
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'ticket.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  async function updateTicketRemain(nft) {
    const id = getMarketItem(nft)["objectId"];
    const tickRemain = (parseInt(getMarketItem(nft)["ticketRemain"]) + 1).toString();
    const eventTable = Moralis.Object.extend("createEvent");
    const query = new Moralis.Query(eventTable);
    await query.get(id).then((obj) => {
      obj.set("ticketRemain", tickRemain)
      obj.save();
    });
  }
  async function returnTicket(nft) {
    setLoading(true);
    const ops = {
      contractAddress: marketAddress,
      functionName: "returnTicket",
      abi: [    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "returnTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }],
      params: {
        id: getMarketItem(nft)["uid"],
        tokenId: nft.token_id,
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateTicketRemain(nft);
        succList();
      },
      onError: (error) => {
        console.log(ops);
        console.log(error);
        setLoading(false);
        failList();
      },
    });
  }

  async function approveAll(nft) {
    setLoading(true);  
    const ops = {
      contractAddress: nft.token_address,
      functionName: "setApprovalForAll",
      abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      params: {
        operator: marketAddress,
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
        
        succApprove();
      },
      onError: (error) => {
        setLoading(false);
        failApprove();
      },
    });
  }

  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const handleQrClick = (nft) => {
    setQr(nft);
    setQrId(nft.token_id);
    setVisibilityQr(true);
  };
  const handleClick = (nft) => {
    setNftDes(getMarketItem(nft)["description"]);
    setNftName(getMarketItem(nft)["name"])
    console.log(nftName);
    setVisibilityDes(true);
  };

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

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approve successfully`,
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

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  


 
  return (
    <>
      <div style={styles.NFTs}>
        {contractABIJson.noContractDeployed && (
          <>
            <Alert
              message="No Smart Contract Details Provided. Please deploy smart contract and provide address + ABI in the MoralisDappProvider.js file"
              type="error"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}

        {NFTBalance &&
          NFTBalance.map((nft, index) => (
            <Card
            title={getMarketItem(nft)["name"]}
              hoverable
              actions={[
                <Tooltip title="View On Blockexplorer">
                  <InfoCircleOutlined
                    onClick={() => 
                      window.open(
                        `${getExplorer(chainId)}token/${nft.token_address}?a=${nft.token_id}`,
                        "_blank"
                      )
                    }
                  />
                </Tooltip>,
                <Tooltip title="Return Ticket">
                  <ShoppingCartOutlined onClick={() => handleSellClick(nft)} />
                </Tooltip>,
                <Tooltip title="Download QR Ticket">
                <QrcodeOutlined onClick={() => handleQrClick(nft)} />
                </Tooltip>,

              ]}
              style={{ width: "240px", border: "2px solid #e7eaf3" }}
              cover={
                <Image
                  onClick={() =>handleClick(nft)}
                  preview={false}
                  src={nft?.token_uri || "error"}
                  fallback="data:image/png;base64,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"
                  alt=""
                  style={{ height: "240px", width: "240" }}
                />
              }
              key={index}
            > 
{/*             
              <Meta title={getMarketItem(nft)["name"]} /> */}
            </Card>
          ))}
      </div>
                
      <Modal
        title={nftName}
        visible={visibleDes}
        onCancel={() => setVisibilityDes(false)}  
        onOk = {() => setVisibilityDes(false)}        
      >
        <p>{nftDes}</p>
      </Modal>

      <Modal
        visible={visibleQr}
        onCancel={() => setVisibilityQr(false)}  
        onOk = {() => downloadQR()} 
        okText = "Download" >  
          <QRCode
            id='qrcode'
            value={qrId}
            size={290}
            level={'H'}
            includeMargin={true}
          />
          <br />
        </Modal>
      
      <Modal
        title={`Return ticket`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => returnTicket(nftToSend)}
        okText="Return"
        footer={[
          <Button onClick={() => setVisibility(false)}>
            Cancel
          </Button>,
          <Button onClick={() => approveAll(nftToSend)} type="primary">
            Approve
          </Button>,
          <Button onClick={() => returnTicket(nftToSend)} type="primary">
            Return
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <img
            src={`${nftToSend?.token_uri}`}
            style={{
              width: "100%",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
        </Spin>
      </Modal>

    </>
  );
}

export default Balance;
