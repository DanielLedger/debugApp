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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

var map;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    setupMap();
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

document.addEventListener('deviceready', onDeviceReady, false);