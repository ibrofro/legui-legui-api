const functions = require("firebase-functions");
const credential = require("./credential.json");
const firebaseAdminSdk = require("firebase-admin");
const createDelivery = require("./lib/createDelivery");
const express = require("express");
const cors = require("cors");

const app = express();
// Admin Sdk configuration
firebaseAdminSdk.initializeApp({
  credential: firebaseAdminSdk.credential.cert(credential),
});

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// When user want to create a delivery.
app.use("/create-delivery", createDelivery);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
