# Description

This app allows user to constantly reads GPS data from the device and upon a button press, records all the GPS data obtained during the recording period and upload it to a designated Firestore database.

The code for GPS reading is adapted from [the example in `react-native-geilcation-service`](https://github.com/Agontuk/react-native-geolocation-service/blob/master/example/src/App.js).

# App Demo

![app demo](doc/app_demo.gif)

# Use the app

There are two ways to use the app.

## Download The Pre-built App

The pre-built app is availbale **only in Andorid**. Please contact the repo maintainer for the link to download the APK file.

## Build Your Own

The app is written in React Native and can run on both Android and iOS. To build the app on your own, follow the steps described below.

1. Set up the environment for React Native according to the [documentation](https://reactnative.dev/docs/environment-setup). Please follow the "React Native CLI Quickstart". If you have React Native set up already, skip this step.
2. Clone this repo
	```bash
	git clone https://github.com/FanchenBao/GPSLocator.git
	```
3. Remove all the `.secret` files and `.gitsecret` folder.
	```bash
	rm **/*.secret
	rm -rf .gitsecret
	```
4. Install node modules
	```bash
	npm install
	```
5. Install pods for iOS.
	```bash
	cd ios && pod install
	```
6. Set up a Firebase project for Android and/or iOS app according to the [documentation](https://firebase.google.com/docs/guides). Make sure to place the `google-services.json` and `GoogleService-Info.plist` in the right folder.
7. Create an API key on Google Cloud Platform (GCP) that allows access to "Maps SDK for Android" and "Maps SDK for iOS". You can create the API key in another GCP project, or within the same Firebase project. Since a Firebase project is essentially a GCP project, I recommend creating the API key within the same Firebase project.
8. Create a `.env` file and put the GCP API key in the file as `GOOGLE_MAP_API_KEY=your-gcp-api-key`
9. From your root folder, run the app on a simulator or your device.
	* For iOS
		```bash
		npm run ios
		```
	* For Android
		```bash
		npm run android
		```

# Contribute to This Repo?

Since I do not have plan to write unit test for the app at the moment, contributing to this repo will be difficult to manage. Therefore, I think the best way to make modification to the codebase is to fork it.