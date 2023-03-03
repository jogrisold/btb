// server/index.js

const express = require("express");
const bp = require('body-parser');
const { getGBFS, getStationStatus } = require("./gbfs-handlers");
const { requestPositionFromAddress } = require("./location-handlers");
const { handleLogIn, 
        handleSignUp, 
        updateUserProfile, 
        getUserProfile, 
        updateUserRoutes, 
        updateUserSettings
    } = require("./user-handlers");

const PORT = process.env.PORT || 3001;

const app = express();

  app.use(bp.json())
  app.use(bp.urlencoded({extended:true}))
  // Create an endpoint to request bike station data
  app.get("/stations", getGBFS)
  app.get("/station-status", getStationStatus)

  // Create an endpoint that will return the lon/lat
  // based on a user address input in the form
  app.get("/get-position/:address", requestPositionFromAddress)

  // Create an endpoint to add a user in the database on sign up
  app.post("/api/signup", handleSignUp)

  // Create an endpoint to retrieve user data based on user ID
  // when they sign in
  app.post("/api/login", handleLogIn)

    // Create an endpoint to retrieve user data to store in state
    // based on user id
    app.get("/api/users/:_id", getUserProfile)

    // Create an endpoint to modify user information when user 
    // submits the preferences form in /profile
    app.patch("/api/update-profile", updateUserProfile)

    // Create an endpoint to modify user information when user 
    // submits the preferences form in /profile
    app.patch("/api/update-settings", updateUserSettings)

    // Create an endpoint to add previous routes to user profile
    app.patch("/api/add-route-to-profile", updateUserRoutes)


    // Catch all endpoint
    app.get("*", (res) => {
        res.status(404).json({
        status: 404,
        message: "Server endpoint does not exist",
        });
    })

  
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});