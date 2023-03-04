// Require opencage - an open source api that allows for conversion of
// address to lng/lat position for use in mapbox
const opencage = require('opencage-api-client');
const { get } = require('request');
require('dotenv').config();
    
// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

// Define a function that will return the lat/lng based on client input
const getPositionFromAddress = async (address) => {
    const requestObj = {
        key: 'ce27352538b74e3c83f2a77d96178a20',
        q: `${address}`,
    };
  
    return new Promise(async (resolve, reject) =>{
        return opencage
        .geocode({ q: requestObj.q, key: requestObj.key })
        .then((data) => {
            const response = JSON.stringify(data);
            return response;
        })
        .then((response) => {
            const parsedResponse = JSON.parse(response)
            return parsedResponse;
         })
         .then((parsedResponse)=>{
            const results = parsedResponse.results;
            const lng = results[0].geometry.lng;
            const lat = results[0].geometry.lat;
    
            // Return the position in the required geojson format
            resolve([lng, lat]);
        })
        .catch((error) => {
            reject(error.message);
        });
        
})
};

const requestPositionFromAddress = async (req, res) => {
    
    try{
    const address = req.params.address.replaceAll("&", " ");
    const result = await getPositionFromAddress(address)
        if(result === undefined){
            //return res.status(404).json({status:404, data: req.params, message: "Address not converted"})
            sendResponse(res, 404, req.params, "Address not converted");
        } else{
            sendResponse(res, 200, result, "Address converted");
        }
            //return res.status(200).json({status:404, data: result, message: "Address converted"})
    } catch (err) {
        console.log(err)
        sendResponse(res, 500, err, "This request resulted in an internal server error");
    }
}

//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
    requestPositionFromAddress
};
//*************************************************************** */