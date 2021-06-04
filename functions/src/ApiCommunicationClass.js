/*
 * @flow
 */
require("dotenv").config();
const axios = require("axios");
const CheckInformationClass = require("./CheckInformationClass");
class ApiCommunicationClass extends CheckInformationClass {
  // Find a user location using 'Nominatim'
  // OpenStreetMap API.
  async geoLocateUser(
    lon: string,
    lat: string
  ): Promise<{
    city: string | "",
    region: string | "",
    displayName: string | "",
  }> {
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
      return {
        city: response.data.address.city || "",
        region: response.data.address.region || "",
        displayName: response.data.display_name || "",
      };
    } else {
      throw new Error("Error while fetching the location");
    }
  }

  async getDistance(params: {
    senderLon: string,
    senderLat: string,
    receiverLon: string,
    receiverLat: string,
  }): Promise<{
    distanceInKilometers: number,
    distanceInMeters: number,
  }> {
    this.checkCoordinates(params.senderLon, params.senderLat);
    this.checkCoordinates(params.receiverLon, params.receiverLat);
    const apiToken: any = process.env.MAPBOX_TOKEN;
    const request =
      "https://api.mapbox.com/directions/v5/mapbox/driving/" +
      params.senderLon +
      "," +
      params.senderLat +
      ";" +
      params.receiverLon +
      "," +
      params.receiverLat +
      "?access_token=" +
      apiToken;

    const response = await axios.get(request);
    if (response.data.routes[0].distance) {
      const roundedDistanceInMeters = Math.round(
        response.data.routes[0].distance
      );
      // Information to retain from the API response
      const distanceInKilometers = roundedDistanceInMeters / 1000;
      const distanceInMeters = roundedDistanceInMeters;

      return {
        distanceInKilometers: distanceInKilometers,
        distanceInMeters: distanceInMeters,
      };
    } else {
      throw new Error("Error while retrieving the distance");
    }
  }
}

module.exports = ApiCommunicationClass;
