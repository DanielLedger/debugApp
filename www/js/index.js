/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const { default: BackgroundGeolocation } = require("cordova-background-geolocation-plugin");

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

var map;

var locTrace = null;

var lWatch = null;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    document.getElementById('startlogs').onclick = onStartLocate;
    document.getElementById('stoplogs').onclick = onStopLocate;

    setupMap();

    //Ask for some permissions we need. For some reason, this doesn't work as expected.
    var permissions = cordova.plugins.permissions;
    var permsRequired = [permissions.ACCESS_FINE_LOCATION, permissions.ACCESS_COARSE_LOCATION, permissions.ACCESS_BACKGROUND_LOCATION];
    permissions.requestPermissions(permsRequired, () => {
        alert("Got permissions successfully.");
    },
    () => {
        alert("Not got required permissions.");
    });

}

function setupMap(){
    map = L.map('map');
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: 'Map data and imagery &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
    	maxZoom: 18
	}).addTo(map);
    //Get our current location and zoom to it.
    map.locate({setView: true, maxZoom: 16});
}

function onStartLocate(){
    console.log("Starting logging...");
    //Wipe the polyline
    if (locTrace !== null){
        locTrace.remove();
        locTrace = null;
    }
    if (!document.getElementById('usePlugin').checked){
        //Use navigator.geolocation
        console.log("Foreground logging (via navigator.geolocation)");
        lWatch = navigator.geolocation.watchPosition((geoLoc) => {
            onLocationFound(geoLoc.coords.latitude, geoLoc.coords.longitude);
        });
    }
    else {
        //Using plugin
        BackgroundGeolocation.configure({
            locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 5,
            distanceFilter: 5,
            notificationTitle: 'Debug app',
            notificationText: 'Debug location logging enabled.',
            startForeground: true,
            debug: true,
            interval: 3000,
            fastestInterval: 3000,
            activitiesInterval: 3000
        });

        //I know I have location permission already, skip authorization stage.
        BackgroundGeolocation.on('location', (loc) => {
            onLocationFound(loc.latitude, loc.longitude);
        });

        BackgroundGeolocation.start();
    }
}

function onStopLocate(){
    if (lWatch !== null){
        navigator.geolocation.clearWatch(lWatch);
    }
    else {
        BackgroundGeolocation.stop();
    }
    console.log("Ending location logging.");
    console.log(`Got points ${locTrace.getLatLngs()}`)
}

function onLocationFound(lat,lon){
    console.log(`Got location lat: ${lat}, lon: ${lon}`);
    if (locTrace === null){
        locTrace = L.polyline([], {color: 'red'});
        locTrace.addTo(map);
    }
    locTrace.addLatLng([lat, lon]);
    console.log(`Showing trace as ${locTrace.getLatLngs()}`);
}

document.addEventListener('deviceready', onDeviceReady, false);