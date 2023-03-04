//*************************************************************** */
"use strict";
//*************************************************************** */

// Require the request-promise package
const request = require('request-promise');
// const rp = require('request-promise')

require("dotenv").config();

// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

// Promise to return detailed station data (available bikes)
const requestStationStatus = () => {
  return new Promise (resolve => {
    request("https://gbfs.velobixi.com/gbfs/en/station_status.json")
      .then((response) => {
        const parsedResponse= JSON.parse(response);
        return parsedResponse;
      })
      .then((parsedResponse) => {
        // Initialize an array to hold our detailed station data objects
        let allStationData = [];
        // Initialize an object to hold the data for each station
        let singleStationData = {};
        // Map through the stations data array within the data object 
        parsedResponse.data.stations.map((station) =>{
            // Retrieve our desired data

            singleStationData =
            {   station_id: station.station_id,
                bikes: station.num_bikes_available,
                e_bikes: station.num_ebikes_available,
                docks: station.num_docks_available,
                renting: station.is_renting,
                returning: station.is_returning
              }
        //  Add it to the allStationssarray via a spread operator
        return allStationData = [...allStationData, singleStationData]
        })
        resolve(allStationData);
      })
  })
}

const requestGBFS = () => {
  return new Promise (resolve => {
    request("https://gbfs.velobixi.com/gbfs/en/station_information.json")
      .then((response) => {
        const parsedResponse= JSON.parse(response);

        return parsedResponse;
      })
      .then((parsedResponse) => {
        // Initialize an array to hold the lat/long of all stations
        let locations = [];
        let stationLocation = [];
        // Map through the stations array within the data object and
        // return the lat and long of each station, along with the 
        // station id to use in looking up the station's data in station_status
        parsedResponse.data.stations.map((station) =>{
            // Retrieve our desired data
            stationLocation =
            {   station_id: station.station_id,
                name: station.name,
                position: [station.lon, station.lat],
                capacity: station.capacity
              }
            // Add it to the locationsarray via a spread operator
            return locations = [ ...locations, stationLocation]
        })
        resolve(locations);
      })
  })
}

const getGBFS = async (req, res) => {
  try {
    const response = await requestGBFS();
    console.log(response);
    sendResponse(res, 200, response, "Bike station data retreived");
    //response.json({status: 200, data: response, message: "Bike station data retreived"});
  } catch (err) {
    console.log('Error: ', err);
    sendResponse(res, 500, err, "500 error from getGBFS");
    //res.status(500).json({status: 500, data: "nope!", message: "It's a 500 error in getGBFS, oh no!"});
  }
};

const getStationStatus = async (req, res) => {
  try {
    const response = await requestStationStatus();
      sendResponse(res, 200, response, "Bike station data retreived");
  } catch (err) {
    console.log('Error: ', err);
    sendResponse(res, 500, err, "500 error from getStationStatus");
    //res.status(500).json({status: 500, data: "nope!", message: "It's a 500 error in getGBFS, oh no!"});
  }
};

//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
    getGBFS,
    getStationStatus
};
//*************************************************************** */