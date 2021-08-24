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

## Usage

```python
import foobar

# returns 'words'
foobar.pluralize('word')

# returns 'geese'
foobar.pluralize('goose')

# returns 'phenomenon'
foobar.singularize('phenomena')
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
