/*
 * @flow
 */

const firebaseAdminSdk = require("firebase-admin");
const CheckInformationClass = require("./CheckInformationClass");
const status = require("./status");
class User extends CheckInformationClass {
  async doesUserExists(
    phone: string,
    uid: string
  ): Promise<{
    phone: string,
    uid: string,
    name: string,
    notificationToken: string,
  }> {
    const querySnapshot = await firebaseAdminSdk
      .firestore()
      .collection("client")
      .where("phone", "==", phone)
      .where("uid", "==", uid)
      .get();
    if (!querySnapshot.empty) {
      let user = {};
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        if (!data.phone || !data.uid || !data.notificationToken || !data.name) {
          throw new Error("Error user retrieved is not a valid one");
        }
        user = {
          phone: data.phone,
          uid: data.uid,
          name: data.name,
          notificationToken: data.notificationToken,
        };
      });
      return user;
    } else {
      throw new Error("Error while fetching the user");
    }
  }

  async getUserByPhone(phone: string): Promise<{
    phone: string,
    uid: string,
    name: string,
    notificationToken: string,
  }> {
    const querySnapshot = await firebaseAdminSdk
      .firestore()
      .collection("client")
      .where("phone", "==", phone)
      .get();
    if (!querySnapshot.empty) {
      let user = {};
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        if (!data.phone || !data.uid || !data.notificationToken || !data.name) {
          let err: any = new Error(status.phoneNotRegistered);
          err.userMustBeNotified = status.phoneNotRegistered;
          throw err;
        }
        user = {
          phone: data.phone,
          uid: data.uid,
          name: data.name,
          notificationToken: data.notificationToken,
        };
      });
      return user;
    } else {
      let err: any = new Error(status.phoneNotRegistered);
      err.userMustBeNotified = status.phoneNotRegistered;
      throw err;
    }
  }
}

module.exports = User;
