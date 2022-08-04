import React, { useState, useEffect } from "react";
import {
  useMoralis,
  useMoralisQuery,} from "react-moralis";
import { Card, Image, Tooltip, Modal, Spin } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import {
  FileSearchOutlined,
  ShoppingCartOutlined,
  MoneyCollectOutlined
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

function ClosedEvent() {
    const { Moralis } = useMoralis();
    const { walletAddress, marketAddress } = useMoralisDapp();
    const [visible, setVisibility] = useState(false);
    const [claim, setClaim] = useState(null);
    const [visibleDes, setVisibilityDes] = useState(false);
    const [nftDes, setNftDes] = useState(null);
    const [nftName, setNftName] = useState(null);
    const contractProcessor = useWeb3ExecuteFunction();

    const queryMarketEvents = useMoralisQuery("createEvent",
    (query) => query.equalTo("isClosed", true).equalTo("organizer", walletAddress).notEqualTo("ticketRemain","0"),

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
        "name": "claimRevenue",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }];

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
      content: `Revenue claimed!`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when claiming this event's revenue`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }


const handleClaimClick = (index) => {
   
    setClaim(index);
    
    setVisibility(true);
  };

  async function claimEv() {
    const tokenDetails = claim;
    const itemID = tokenDetails["uid"];
    const ops = {
      contractAddress: marketAddress,
      functionName: "claimRevenue",
      abi: contractABIJson,
      params: {
        id: itemID
      },
      msgValue: 0,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        succPurchase();
      },
      onError: (error) => {
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
                  <Tooltip title="Claim Revenue">
                  <MoneyCollectOutlined
                    onClick={() =>
                      handleClaimClick(index)
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
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
        {claim ? (
          <Modal
            title={`Do you want to claim the event's revenue?`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => claimEv()}
            okText="Buy"
          >
          </Modal>
        ) : (
          <Modal
            title={`Claim`}
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

export default ClosedEvent;