// @flow
class CheckInformationClass {
  checkName(name: string): string {
    if (name.length > 2) {
      const capitalFirst = name.charAt(0).toUpperCase();
      const nameWithoutFirstChar = name.substring(1);
      return capitalFirst + nameWithoutFirstChar;
    } else {
      throw new Error(`Invalid name '${name}'`);
    }
  }

  checkIfExist(param: string):string {
    if (typeof param === "string" && param) {
      return param;
    } else {
      throw new Error(`The param '${param}' is not valid`);
    }
  }
 
  checkCoordinates(lon: string, lat: string): { lon: string, lat: string } {
    const associated = lat + "," + lon;
    const regex =
      /^-?(90|[0-8]?\d)(\.\d+)?, *-?(180|1[0-7]\d|\d?\d)(\.\d+)?$/gm;
    const match = associated.match(regex);
    if (match) {
      return { lon: lon, lat: lat };
    } else {
      throw new Error("Invalid coordinates");
    }
  }

  checkSnPhone(phone: string): string {
    const regex = /^(221|\+221|00221|\+00221)?(77|78|75|70|76)[0-9]{7}$/;
    if (regex.test(phone)) {
      return phone;
    } else {
        throw new Error(`Invalid phone number '${phone}'`);
      
    }
  }

  checkIfRegionIsValid(region: string): string {
    const regex = /^(Dakar){1}$/i;
    if (regex.test(region)) {
      return region;
    } else {
        throw new Error(`Only Dakar is supported as region.`);
      
    }
  }
}
module.exports = CheckInformationClass;
