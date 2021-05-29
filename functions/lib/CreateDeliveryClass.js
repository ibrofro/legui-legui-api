class CreateDelivery {
  constructor(senderPhone, receiverPhone, senderUid, senderLon, senderLat) {
    this.senderPhone = senderPhone;
    this.receiverPhone = receiverPhone;
    this.senderUid = senderUid;
    this.senderCoords = {
      lon: senderLon,
      lat: senderLat
    };
  }

}

exports.CreateDelivery;