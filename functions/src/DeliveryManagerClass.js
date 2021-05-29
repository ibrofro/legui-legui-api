// @flow
const firebaseAdminSdk = require("firebase-admin");
const CheckInformationClass = require("./CheckInformationClass.js");

class DeliveryManagerClass extends CheckInformationClass {
  senderPhone: string;
  receiverPhone: string;
  collection: any;
  constructor(senderPhone: string, receiverPhone: string) {
    super();
    this.senderPhone = this.checkSnPhone(senderPhone);
    this.receiverPhone = this.checkSnPhone(receiverPhone);
    this.collection = firebaseAdminSdk.firestore().collection("delivery");
  }

  async createDelivery(params: {
    senderUid: string,
    senderName: string,
    receiverName: string,
    senderNotificationToken: string,
    senderLongitude: string,
    senderLatitude: string,
    city: string,
    region: string,
    displayName: string,
  }): Promise<boolean> {
    const senderUidVerified = super.checkIfExist(params.senderUid);
    const senderNameVerified = super.checkName(params.senderName);
    const receiverNameVerified = super.checkName(params.receiverName);
    const senderNotificationTokenVerified = super.checkIfExist(
      params.senderNotificationToken
    );
    const senderCoordinatesVerified = super.checkCoordinates(
      params.senderLongitude,
      params.senderLatitude
    );

    // Put verified information on the
    // delivery collection.
    const result = await this.collection.add({
      phoneArray: [this.senderPhone, this.receiverPhone],
      senderUid: senderUidVerified,
      senderName: senderNameVerified,
      senderPhone: this.senderPhone,
      receiverName: receiverNameVerified,
      receiverPhone: this.receiverPhone,
      senderNotificationToken: senderNotificationTokenVerified,
      senderLocation: new firebaseAdminSdk.firestore.GeoPoint(
        parseInt(senderCoordinatesVerified.lat),
        parseInt(senderCoordinatesVerified.lon)
      ),
      senderCity: params.city ? String(params.city) : "",
      senderAddress: params.displayName ? String(params.displayName) : "",
      senderRegion: params.region ? String(params.region) : "",
      status: "",
      createdAt: new Date(),
      price: "",
    });
    if (result.id) {
      return true;
    } else {
      throw new Error("Error while adding the delivery to Firestore");
    }
  }
}

module.exports = DeliveryManagerClass;
