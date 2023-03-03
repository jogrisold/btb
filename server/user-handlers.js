"use strict";

// Require MongoDB and dotenv
const { MongoClient } = require("mongodb");
require("dotenv").config();
const {sendResponse} = require('./utils')

// Mongo constants
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Unique ID creation for each data point
const { v4: uuidv4 } = require("uuid");

// Hash conversion to encrypt user passwords
const bcrypt = require("bcrypt");

//*************************************************************** */
// Returns user data from the database on login
//*************************************************************** */
const handleLogIn = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("BTB");
  let user = null;

  try {
    await client.connect();
    console.log("login")
    console.log(req.body)
    user = await db.collection("users").findOne({ email: req.body.email });

    if (user) {
      // Check if the database encrypted password matches the login
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({
          status: 200,
          data: user,
          message: "Log in success",
        });
      } else {
        res.status(404).json({
          status: 404,
          data: req.body,
          message: "Invalid Password",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        data: req.body,
        message: "No account found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }
  client.close();
};

//*************************************************************** */
// Adds new user data when a user submits a sign up request
//*************************************************************** */
const handleSignUp = async (req, res) => {
    res.set({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
  });
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("BTB");
  let user = null;
  try {
    await client.connect();
    console.log("sign up")
    console.log(req.body)
    user = await db.collection("users").findOne({ email: req.body.email });
    // Check if the entered email already exists in the database
    if (!user) {
      req.body._id = uuidv4();
      // Encrypt the user password
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = encryptedPassword;
      // Add some empty data points to hold user information and settings
      req.body.favorites = [];
      req.body.previous_searches = [];
      req.body.settings = {use_bike_paths: true};
      req.body.home = "";
      req.body.work = "";
      // Add the new user, including an encrypted password that will
      // not be decryptable if intercepted
      const userInserted = await db.collection("users").insertOne(req.body);
      if (userInserted) {
        res.status(200).json({
          status: 200,
          data: req.body,
        });
      } else {
        res.status(404).json({
          status: 404,
          data: req.body,
          message: "Sign up request failed",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        data: req.body,
        message: "That email already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }
  client.close();
};
//*************************************************************** */
// Updates user profile
//*************************************************************** */
const updateUserProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const updatedUserProfile = req.body;
  console.log("req.body user profile");
  console.log(req.body);
  console.log(updatedUserProfile.given_name);
  console.log(updatedUserProfile.family_name);
  console.log(updatedUserProfile.home);
  console.log(updatedUserProfile.work);
  try {
    // Connect to client
    await client.connect();
    console.log('connected');
    const db = client.db("BTB");
    // Check if the user exists in the database
    const checkUser = await db.collection("users")
    .find({_id: updatedUserProfile._id }).toArray();
    // If that failed, exit  
    if(checkUser.length === 0){
      sendResponse(res, 404, updatedUserProfile._id, "User not found");
    } 
    // Otherwise, update the profile
    const addRoute = await db.collection("users").findOneAndUpdate(
      // Find the user by _id
      {_id: updatedUserProfile._id}, 
      // Update the data based on the input
      {$set: 
        { 
          given_name : updatedUserProfile.given_name, 
          family_name : updatedUserProfile.family_name,
          email: updatedUserProfile.email,
          home : updatedUserProfile.home,
          work : updatedUserProfile.work
        }
      }
      )
    const updatedUser = await db.collection("users")
    .find({_id: updatedUserProfile._id }).toArray();
      
    if(addRoute){
      return res
        .status(200)
        .json(
          {status:200, 
          data: updatedUser, 
          message:"User profile successfully updated"});
    } else {
      sendResponse(res, 404, updatedUserProfile, "The user profile was not found");
    }
  } catch (err) {
    console.log("Failed to update user in database: ", err);
    sendResponse(res, 500, updatedUserProfile._id, err.message)
  }
  client.close();
};
//*************************************************************** */
// Updates user settings
//*************************************************************** */
const updateUserSettings = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const updatedUserSettings = req.body;
  console.log("req.body user settings");
  console.log(req.body);

  try {
    // Connect to client
    await client.connect();
    console.log('connected');
    const db = client.db("BTB");
    // Check if the user exists in the database
    const checkUser = await db.collection("users")
    .find({_id: updatedUserSettings._id }).toArray();
    // If that failed, exit  
    if(checkUser.length === 0){
      sendResponse(res, 404, updatedUserSettings.email, "User not found");
    } 
    // Otherwise, update the profile
    const updateSettings = await db.collection("users").findOneAndUpdate(
      // Find the user by email
      {_id: updatedUserSettings._id}, 
      // Reset the settings object based on information passed by req.body 
      {
        $set: 
        { settings : updatedUserSettings.settings }
      }
      )
    
    const updatedUser = await db.collection("users")
    .find({_id: updatedUserSettings._id }).toArray();
    if(updateSettings){
      return res
        .status(200)
        .json(
          {status:200, 
          data: updatedUser, 
          message:"User profile successfully updated"});
    } else {
      sendResponse(res, 404, updatedUserSettings._id, "The user profile was not found");
    }
  } catch (err) {
    console.log("Failed to update user in database: ", err);
    sendResponse(res, 500, updatedUserSettings._id, err.message)
  }
  client.close();
};
//*************************************************************** */
// Adds route to user profile
//*************************************************************** */
const updateUserRoutes = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  console.log("req.body update")
  console.log(req.body)
  try {
    // Connect to client
    await client.connect();
    console.log('connected');
    const db = client.db("BTB");
    // Check if the user exists in the database
    const checkUser = await db.collection("users")
    .find({_id: req.body._id }).toArray();
    // If that failed, exit  
    if(checkUser.length === 0){
      sendResponse(res, 404, req.body._id, "User not found");
    } 
    // Otherwise, add the route
    const addRoute = await db.collection("users").findOneAndUpdate(
      // Find the user by id
      {_id: req.body._id}, 
      // Push the search data object to the previous searches array
      // in position 0 (unshift), in order to render the searches in
      // order of most recent to least recent.
      {
        $push: { 
          previous_searches : {
            $each: [req.body.route],
            $position: 0
          }
        }
      }
      )
  
    if(addRoute){
      return sendResponse(res, 200, req.body, "Route successfully added");
    } else {
      sendResponse(res, 404, req.body._id, "The route was not found");
      
    }
  } catch (err) {
    console.log("Failed to add route: ", err);
    sendResponse(res, 500, req.body._id, err.message)
  }
  client.close();
};

//*************************************************************** */
// Retrieve user profile based on their id
//*************************************************************** */
const getUserProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("BTB");
  console.log("req.params");
  console.log(req.params);
  console.log(req.params._id);
  try {
    await client.connect();
    const user = await db.collection("users").findOne({ _id: req.params._id });
    if (user) {
      res.status(200).json({
        status: 200,
        data: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "No user to display",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
  client.close();
};

module.exports = {
  handleLogIn,
  handleSignUp,
  updateUserProfile,
  getUserProfile,
  updateUserRoutes,
  updateUserSettings
};