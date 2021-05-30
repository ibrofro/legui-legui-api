const firebaseAdminSdk = require("firebase-admin");

const CheckInformationClass = require("./CheckInformationClass.js");

class DeliveryManagerClass extends CheckInformationClass {
  constructor() {
    super();
    this.collection = firebaseAdminSdk.firestore().collection("delivery");
  }

  async createDelivery(params) {
    const senderUidVerified = super.checkIfExist(params.senderUid);
    const senderNameVerified = super.checkName(params.senderName);
    const receiverNameVerified = super.checkName(params.receiverName);
    const senderPhoneVerified = super.checkSnPhone(params.senderPhone);
    const receiverPhoneVerified = super.checkSnPhone(params.receiverPhone);
    const senderNotificationTokenVerified = super.checkIfExist(params.senderNotificationToken);
    const senderCoordinatesVerified = super.checkCoordinates(params.senderLongitude, params.senderLatitude);
    const senderRegionVerified = super.checkIfRegionIsValid(params.region); // Put verified information on the
    // delivery collection.

    const result = await this.collection.add({
      phoneArray: [senderPhoneVerified, receiverPhoneVerified],
      senderUid: senderUidVerified,
      senderName: senderNameVerified,
      senderPhone: senderPhoneVerified,
      receiverName: receiverNameVerified,
      receiverPhone: receiverPhoneVerified,
      senderNotificationToken: senderNotificationTokenVerified,
      senderLocation: new firebaseAdminSdk.firestore.GeoPoint(parseInt(senderCoordinatesVerified.lat), parseInt(senderCoordinatesVerified.lon)),
      senderCity: params.city ? String(params.city) : "",
      senderAddress: params.displayName ? String(params.displayName) : "",
      senderRegion: super.checkIfRegionIsValid(params.region),
      status: "waiting-for-receiver-confirmation",
      createdAt: new Date(),
      price: ""
    });

    if (result.id) {
      return true;
    } else {
      throw new Error("Error while adding the delivery to Firestore");
    }
  }

}

module.exports = DeliveryManagerClass;