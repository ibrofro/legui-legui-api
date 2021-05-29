/*
 * @flow
 */

const firebaseAdminSdk = require("firebase-admin");
const CheckInformationClass = require("./CheckInformationClass");
class User extends CheckInformationClass {
  uid: string;
  phone: string;
  constructor(uid: string, phone: string) {
    super();
    this.uid = this.checkIfExist(uid);
    this.phone = this.checkIfExist(phone);
    console.log(this.phone +" "+ this.uid)
  }

  async doesUserExists(): Promise<{ phone: string, uid: string }> {
    const querySnapshot = await firebaseAdminSdk
      .firestore()
      .collection("client")
      .where("phone", "==", this.phone)
      .where("uid", "==", this.uid)
      .get();
    if (!querySnapshot.empty) {
      let user = {}
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        console.log(data)
        user = { phone: data.phone, uid: data.uid };
      });
      return user;
    } else {
      throw new TypeError("Error while fetching the user");
    }
  }
}

module.exports = User;
