import React, { useState, useEffect } from "react";
import {
  useMoralis,
  useMoralisQuery,} from "react-moralis";
import { Card, Image, Tooltip, Modal, Spin } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import {
  FileSearchOutlined,
  ShoppingCartOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

import { useWeb3ExecuteFunction } from "react-moralis";

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
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function OpenEvent() {
    const { Moralis } = useMoralis();
    const { walletAddress, marketAddress } = useMoralisDapp();
    const [visible, setVisibility] = useState(false);
    const [Close, setClose] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibleDes, setVisibilityDes] = useState(false);
    const [nftDes, setNftDes] = useState(null);
    const [nftName, setNftName] = useState(null);
    const contractProcessor = useWeb3ExecuteFunction();

    const queryMarketEvents = useMoralisQuery("createEvent",
    (query) => query.equalTo("isClosed", false).equalTo("organizer", walletAddress).notEqualTo("ticketRemain","0"),

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
    const contractABIJson = [{
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "closeEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }];
//     const queryEventMetadatas = useMoralisQuery("Metadata");
//     const fetchEventMetadatas = JSON.parse(
//         JSON.stringify(queryEventMetadatas.data, [
//             "URI",
//             "name",
//             "description",
//             "image"
//         ]

//         )
//     );
//     console.log(fetchEventMetadatas);
    
// const fetchAll = fetchEventMetadatas.map((item) => {
//     return {
//       ...item, // will consist all the items from object2
//       // get index from object1 where the code matches
//       index: fetchMarketEvents.find(elem => elem.uri === item.URI).index 
//     }
//   });
//   console.log(fetchAll);
//     const getEvent = (uri) => {
//         const result = fetchEventMetadatas?.find(
//           (e) =>
//             e.URI === uri
//         );
//         console.log(result);
//         return Object.values(result);
//       };
const handleClick = (index) => {
    setNftDes(index["description"]);
    setNftName(index["name"])
    console.log(nftName);
    setVisibilityDes(true);
  };
function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Close event successfully!`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when closing this event`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateEvent() {
    const id = Close["objectId"];
    const eventTable = Moralis.Object.extend("createEvent");
    const query = new Moralis.Query(eventTable);
    await query.get(id).then((obj) => {
      obj.set("isClosed", true)
      obj.save();
    });
  }
const handleCloseClick = (index) => {
   
    setClose(index);
    
    setVisibility(true);
  };

  async function purchase() {
    setLoading(true);
    const tokenDetails = Close;
    const itemID = tokenDetails["uid"];
    const ops = {
      contractAddress: marketAddress,
      functionName: "closeEvent",
      abi: contractABIJson,
      params: {
        id: itemID
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateEvent();
        succPurchase();
      },
      onError: (error) => {
        setLoading(false);
        failPurchase();
        console.log(error);
      },
    });
  }
    return (
        <>
        <div>
        <div style={styles.NFTs}>

        {fetchMarketEvents.map((index) => (
              <Card
                hoverable
                actions={[
                  <Tooltip title="Read Event Description">
                    <FileSearchOutlined
                      onClick={() =>
                        handleClick(index)
                      }
                    />
                  </Tooltip>,
                  <Tooltip title="Close Event">
                  <CloseCircleOutlined
                    onClick={() =>
                      handleCloseClick(index)
                    }
                  />
                </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
               title = {index["name"]} 
                cover={
                    <Image
                      onClick={() =>
                        console.log(index)}
                      preview={false}
                      src={index["uri"] || "error"}
                      fallback="data:image/png;base64,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"
                      alt=""
                      style={{ height: "240px" }}
                    />
                  }
                key={index}
              >
                <p>Price: {index["ticketPrice"] / ("1e" + 18)} BNB</p>
                <p>TicketRemain: {index["ticketRemain"]}</p>
              </Card>
            ))}
            <div></div>
        </div>
        <Modal
        title={nftName}
        visible={visibleDes}
        onCancel={() => setVisibilityDes(false)}    
        onOk = {() => setVisibilityDes(false)}   
      >
        <p>{nftDes}</p>
      </Modal>
        {Close ? (
          <Modal
            title={`Do you want to close this event?`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => purchase()}
            okText="Yes"
          >

          </Modal>
        ) : (
          <Modal
            title={`Buy`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
          >
          </Modal>
        )}
        </div>
        </>
    )

}

export default OpenEvent;