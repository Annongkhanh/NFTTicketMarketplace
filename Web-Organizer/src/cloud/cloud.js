Moralis.Cloud.define("getNFT", async(request) => {
    const logger = Moralis.Cloud.getLogger();
    let NFTId = request.params.imageURl;
    data = await Moralis.Cloud.httpRequest({ url: "https://wkmrsjag3nvm.usemoralis.com/" + paddedHex + ".json" })
    return data.text
        //.then(function(httpResponse){
        //       return httpResponse.text;})
})