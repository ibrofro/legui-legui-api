const functions = require("firebase-functions");
const credential = require("./credential.json");
const firebaseAdminSdk = require("firebase-admin");
const createDelivery = require("./lib/createDelivery");
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

// Admin Sdk configuration
firebaseAdminSdk.initializeApp({
  credential: firebaseAdminSdk.credential.cert(credential),
});

// Body parser.
const app = express();
// let bodyParser = app.use(bodyParser.json());

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// When user want to create a delivery.
app.use("/create-delivery", createDelivery);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
