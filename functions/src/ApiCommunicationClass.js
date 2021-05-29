require("dotenv").config();
const axios = require("axios");
const CheckInformationClass = require("../lib/CheckInformationClass");
class ApiCommunicationClass extends CheckInformationClass {
  // Find a user location using 'Nominatim'
  // OpenStreetMap API.
  async geoLocateUser(lon: string, lat: string): {} {
    const verifiedCoords = this.checkCoordinates(lon, lat);
    const request =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lon=" +
      verifiedCoords.lon +
      "&lat=" +
      verifiedCoords.lat +
      "&zoom=18";
    const response = await axios.get(request);

    const city = response.data.address.city;
    const region = response.data.address.region;
    const displayName = response.data.display_name;
    if (city || region || displayName) {
      console.log(`city ${city} region ${region} displayName: ${displayName}`);
      return {
        city: response.data.address.city || "",
        region: response.data.address.region || "",
        displayName: response.data.display_name || "",
      };
    } else {
      throw new Error("Error while fetching the location");
    }
  }
}

module.exports = ApiCommunicationClass;
