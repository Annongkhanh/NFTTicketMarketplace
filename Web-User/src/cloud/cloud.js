Moralis.Cloud.define("getNFT", async(request) => {
    const logger = Moralis.Cloud.getLogger();
    let NFTId = request.params.nftId;
    let hexId = parseInt(NFTId).toString(16);
    let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + hexId).slice(-64);
    logger.info(paddedHex);
    data = await Moralis.Cloud.httpRequest({ url: "https://wkmrsjag3nvm.usemoralis.com/" + paddedHex + ".json" })
    return data.text
        //.then(function(httpResponse){
        //       return httpResponse.text;})
})