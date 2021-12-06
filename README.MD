# IMPORTANT: Do NOT merge this branch to master!

# Description

This branch contains an extended version of the original app. The extended app supports data collection capabilities that are specific to a research endeavor. In addition to recording GPS data from the device, this app is also able to trigger an emitter to emit mock probe request, terminate the emission, and verify whether the mock probe requests have been collected and recorded. The goal of this app is to streamline the data collection process by automating all the intricate and repetitive steps.

For the general introduction of the app and how to download or build it, refer to the [readme file](https://github.com/FanchenBao/GPSLocator) under the master branch.

# App Demo

![app demo](doc/data_collection_app_demo.gif)

# FAQ

1. What conditions must be met before mock probe request emission can be started?
One, an emitter must be specified for actually performing the emission. Two, GPS must be enabled and put under observation mode. Translating these conditions to the app, before pressing `Start Record & Emit`, we must use the `Select Emitter` button to choose an emitter and press "Start GPS".

2. Where is the data for emitters stored?
In the Firestore within this Firebase project.

3. What is a MAC prefix?
A mock probe request has a custom-made MAC address. The first 8 chars of the MAC address is the MAC prefix (the remaining lettters are randomized), in the format of xx:xx:xx, where each char is a digit from 0 to 9. MAC prefix is used to distinquish probe requests emitted at one data collection point from those emitted at another.

MAC prefix is created by the emitter from the current timestamp (HH:mm:ss) and offered to the app as return value when the app commands the emitter to start mock probe request emission.

4. What does the `Verify Last Emission` button do?
When mock probe request emission is terminated by pressing the `Stop Record & Emit` button, in addition to the termination action, the app also queries the database for the number of probe requests collected and uploaded by each sensor. This piece of information allows a researcher to confirm whether the previous emission is successful. `Verify Last Emission` performs the same database query. It is needed because sometimes the query conducted from `Stop Record & Emit` happens before the collected probe requests are uploaded (as shown in the demo). In such case, we need to press `Verify Last Emission` repeatedly until the query shows the updated count of collected probe requests (as shown in the demo). This shall happen at most 30 seconds after emission ends.

5. What if there is no update on probe request count?
It is also possible that after pressing the `Verify Last Emission` button for sufficiently long period of time, there is still no update on the probe request count, or the count is very low (the meaning of "low" must be derived empirically). In such case, the most likely explanation is that either the emiter fails to emit probe requests or the sensors fail to capture or upload them. Either way, this situation means the probe requests prefixed by the most recent MAC prefix shall not be included in data analysis, and the health condition of the emitter or sensors must be verified.

6. What does the `Delete Last Emission` button do?
In the case where a session of probe request emission fails, we can press the `Delete Last Emission` button to remove the MAC prefix and its associated GPS records from Firestore. This is to ensure that failed probe request emission will NOT be included in any data analysis (to be more specific, the MAC prefixes recorded in Firestore correspond to each data collection point. Deleting MAC prefix is the same as giving up all the associated probe request data).

7. How does the app talk to the emitter and query the probe request database?
The app calls specific Firebase functions, which then calls the API exposed by the emitter for simple command-and-response interaction, or creates connection to the probe request database and makes the desired data query. The repo for the Firebase functions can be accessed [here](), but it is a private repo.

8. Is the app versioning still the same in this branch?
No, the versioning for the app builds in this branch is different from that in master. All app versions in this branch ends with the chars `-data-collect`.