# Description

This API is built with NodeJs and firebase cloud functions for an mobile App. The main purpose of the API is to be a delivery manager and perform verification's on the deliveries.
The API also make sure the delivery is correctly setup by each part (Deliverer,clients[sender,receiver]), it can Geolocate users, calculate the distance, and evaluate the price based on the distance.  

# Installation
  #### Requirements
- You must have "Firebase CLI" if not, follow this [official link](https://firebase.google.com/docs/cli#install_the_firebase_cli "firebase cli") to install it.
- After the installation you must Login with your firebase credentials, if don't have a firebase account, create one (It's free, for a basic plan!)
```bash
firebase login
```
- Create a project on firebase.
 [official link](https://console.firebase.google.com/ "Google's Homepage")
- Install the Local Emulator Suite follow this [official link](https://firebase.google.com/docs/emulator-suite/install_and_configure "Emulator suite") to install it
- When firebase CLI prompted you for services to install choose (Firestore,Cloud Function, and Local emulator suite).
- Clone this repository on your machine
- Copy everything in the folder "legui-legui-api" and past the files and folders on the root of your project directory.(when same files or folders are found on your directory, confirm the replacement)
- Navigate to functions folder and run the command to install dependencies
```bash
npm install
```
- Create a .env file into "./functions" folder and make sure to have a Mapbox token for the geolocation feature to work (you can create your own Mapbox token they have a free plan" 
```bash
MAPBOX_TOKEN=token
```
- Create a credential.json file into "./functions" folder and make sure to copy your credentials from firebase to credential.json file  
```bash
{
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "-----BEGIN PRIVATE KEY-----\\n-----END PRIVATE KEY-----\n",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
  }
  
```

- Navigate to your project root folder and run the command  
```bash
firebase emulators:start --only "functions,firestore" --import "./firestore_data";
```

## Usage

```javascript
...api/create-delivery ::POST
JSON {
     "senderUid": string,
      "receiverPhone:string,
      "senderName":string,
      "receiverName":string,
      "senderPhone:string,
      "senderNotificationToken":string,
      "senderLatitude": string,
      "senderLongitude": string,
      "senderPayer":boolean,
      "receiverPayer":boolean
}

...api/getprice ::POST
JSON {
     
      "receiverPhone:string,
      "receiverUid":string,
      "receiverName":string,
      "senderPhone:string,
      "deliveryId":string,
      "receiverNotificationToken":string,
      "senderLatitude": string,
      "senderLongitude": string,
      "receiverLatitude": string,
      "receiverLongitude": string,
      "senderPayer":boolean,
      "receiverPayer":boolean
}

...api/finish-delivery-setup ::POST
JSON {
     
      "receiverPhone:string,
      "receiverUid":string,
      "receiverName":string,
      "senderPhone:string,
      "deliveryId":string,
      "receiverNotificationToken":string,
      "senderLatitude": string,
      "senderLongitude": string,
      "receiverLatitude": string,
      "receiverLongitude": string,
      "senderPayer":boolean,
      "receiverPayer":boolean
}

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
