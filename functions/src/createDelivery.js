const app = require("express");
const route: any = app.Router();
const functions = require("firebase-functions");
const DeliveryManagerClass = require("../lib/DeliveryManagerClass");
const ApiCommunicationClass = require("../lib/ApiCommunicationClass");
const UserClass = require("../lib/UserClass");
route.post("/", async (req, res) => {
  try {
    const dt = req.body;
    // Check if the user exists.
    const userIns = new UserClass(dt.senderUid, dt.senderPhone);
    const user = await userIns.doesUserExists();

    // Retrieve the location
    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(
      dt.senderLongitude,
      dt.senderLatitude
    );

    // Create the delivery
    const deliveryManager = new DeliveryManagerClass(
      dt.senderPhone,
      dt.receiverPhone
    );
    const deliveryParam = { ...dt, ...location };
    const created = await deliveryManager.createDelivery(deliveryParam);
    res.send(created);
  } catch (error) {
    console.log(`${error.stack}`);
    res.status(500)
    res.send("An error occured");
  }
});
module.exports = route;
