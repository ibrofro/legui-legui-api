class CheckInformationClass {
  checkName(name) {
    if (name.length > 2) {
      const capitalFirst = name.charAt(0).toUpperCase();
      const nameWithoutFirstChar = name.substring(1);
      return capitalFirst + nameWithoutFirstChar;
    } else {
      throw new Error(`Invalid name '${name}'`);
    }
  }

  checkIfExist(param) {
    if (typeof param === "string" && param) {
      return param;
    } else {
      throw new Error(`The param '${param}' is not valid`);
    }
  }

  checkCoordinates(lon, lat) {
    const associated = lat + "," + lon;
    const regex = /^-?(90|[0-8]?\d)(\.\d+)?, *-?(180|1[0-7]\d|\d?\d)(\.\d+)?$/gm;
    const match = associated.match(regex);

    if (match) {
      return {
        lon: lon,
        lat: lat
      };
    } else {
      throw new Error("Invalid coordinates");
    }
  }

  checkSnPhone(phone) {
    const regex = /^(221|\+221|00221|\+00221)?(77|78|75|70|76)[0-9]{7}$/;

    if (regex.test(phone)) {
      return phone;
    } else {
      throw new Error(`Invalid phone number '${phone}'`);
    }
  }

}

module.exports = CheckInformationClass;