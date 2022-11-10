# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.6.0-data-collect] - 2022-11-10

### Added
- Add a timer which is triggered when emission starts and terminated when emission ends. This simplifies the data collection process as we don't have to resort to an outside timer to keep track of the emission duration.
- Add an emission counter that keeps track of the number of times we have triggered emission consecutively. A built-in mechanism ensures that once we have reached the max number of emission repeats, no more emission can be made unless we reset the counter. This helps reduce the chance of error in data collection.
- The emit duration and emit repeats values are stored in the database.

### Changed
- When uploading GPS data, also include the emitter ID. This allows us to do data collection with multiple emitters, as each emitter has its designated space on Firestore for recording GPS and mac address prefix data.

## [v0.5.1-data-collect] - 2022-11-03

### Changed
- Fix the android build issue, which is reported in detail here: https://github.com/facebook/react-native/issues/35210

### Added
- Add capability to choose which type of sensors are capturing probe request (prod or dev). This allows the app to query either the prod or dev database.
- Make the display of the probe request count query results scrollable. This is to accommodate the number of prod sensors to join the data collection effort.

## [v0.5.0-data-collect] - 2021-12-05

### Added
- Add capability to send remote-control signal to a target sensor to start mock probe request injection.
- Add capability to send remote-control signal to a target sensor to terminate probe request injection.
- Add capability to query probe request database to see whether the previous round of injection has been captured.
- Add capability to delete the record of a previous probe request injection on Firebase.

## [v0.4.0] - 2021-12-02

### Changed
- App ready for recording GPS data and save them to Firestore.