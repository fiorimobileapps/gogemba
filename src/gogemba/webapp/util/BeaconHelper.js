sap.ui.define([
	"gogemba/util/PermissionHelper",
	"sap/ui/model/json/JSONModel"
], function(PermissionHelper, JSONModel) {
	"use strict";

	return {

		beaconRegions: null,
		detectedBeacons: [],

		init: function() {
			if (!window.cordova) {
				return;
			}

			/*if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					that.getBeaconList(position.coords.latitude, position.coords.longitude);
				}, function(error) {
					that.getBeaconList();
				}, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
			}
			else*/
			{
				PermissionHelper.hasPermission("ACCESS_FINE_LOCATION",
						jQuery.proxy(this._hasLocationPermission, this),
						PermissionHelper.requestPermissionError);
			}
		},

		_hasLocationPermission: function(oEvent) {
			if (oEvent.hasPermission) {
				this.getBeaconList();
			} else {
				PermissionHelper.requestPermission("ACCESS_FINE_LOCATION",
					jQuery.proxy(this._requestLocationPermission, this),
					PermissionHelper.requestPermissionError);
			}
		},
		
		_requestLocationPermission: function(oEvent) {
			if (oEvent.hasPermission) {
				this._hasLocationPermission(oEvent);
			} else {
				jQuery.sap.log.error("Request permission rejected");
			}
		},

		getBeaconList: function(latitude, longitude) {
			/*var that = this;
			var url = "/destinations/bmp/regions/search";
			if (latitude && longitude) {
				url += ("?latitude=" + latitude + "&longitude=" + longitude);
			}
			// get beacon info from Beacon Management Service
			jQuery.ajax({
				url: url,
				async: true,
				cache: false,
				success: function(data, textStatus, xhr) {
					that.parseBeaconList(data);
					that.startMonitoringAndRanging();
				},
				error: function(xhr, textStatus, e) {
					jQuery.sap.log.warning(e.message);
				}
			});*/
			var oModel = new JSONModel();
			oModel.loadData(jQuery.sap.getModulePath("gogemba") + "/util/beacon.json", null, false);

			this.parseBeaconList(oModel.getData());
			this.startMonitoringAndRanging();
		},

		parseBeaconList: function(data) {
			this.beaconRegions = [];
			var region, beacon;
			for (var i = 0; i < data.length; i++) {
				if (data[i].assignedBeacons) {
					for (var j = 0; j < data[i].assignedBeacons.length; j++) {
						region = {};
						beacon = data[i].assignedBeacons[j];
						region.id = beacon.beaconId;
						region.name = beacon.name;
						region.uuid = beacon.guid;
						region.major = beacon.major;
						region.minor = beacon.minor;
						region.xPosition = beacon.xPosition;
						region.yPosition = beacon.yPosition;
						this.beaconRegions[this.getBeaconId(region)] = region;
					}
				}
			}
		},

		startMonitoringAndRanging: function() {
			if (!cordova.plugins.locationManager) {
				return;
			}

			var that = this;

			function onDidDetermineStateForRegion(result) {
				if (result.state === "CLRegionStateOutside") {
					var beaconRegion = that.beaconRegions[that.getBeaconId(result.region)];
					beaconRegion.accuracy = -1;
					beaconRegion.proximity = "Unknown";
				}
			}

			function onDidRangeBeaconsInRegion(result) {
				that.updateNearestBeacon(result.beacons);
			}

			function onError(errorMessage) {
				jQuery.sap.log.error("Monitoring beacons did fail: " + errorMessage);
			}

			// Request permission from user to access location info.
			cordova.plugins.locationManager.requestAlwaysAuthorization();

			// Create delegate object that holds beacon callback functions.
			var delegate = new cordova.plugins.locationManager.Delegate();
			cordova.plugins.locationManager.setDelegate(delegate);

			// Set delegate functions.
			delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
			delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

			// Start monitoring and ranging beacons.
			this.startMonitoringAndRangingRegions(this.beaconRegions, this.onError);
		},

		startMonitoringAndRangingRegions: function(regions, errorCallback) {
			// Start monitoring and ranging regions.
			for (var i in regions) {
				this.startMonitoringAndRangingRegion(regions[i], errorCallback);
			}
		},

		startMonitoringAndRangingRegion: function(region, errorCallback) {
			// Create a region object.
			var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
				region.id,
				region.uuid,
				region.major,
				region.minor);

			// Start ranging.
			cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail(errorCallback)
				.done();

			// Start monitoring.
			cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
				.fail(errorCallback)
				.done();
		},

		stopMonitoringAndRanging: function() {
			// Start monitoring and ranging beacons.
			this.stopMonitoringAndRangingRegions(this.beaconRegions, this.onError);
		},

		stopMonitoringAndRangingRegions: function(regions, errorCallback) {
			// Start monitoring and ranging regions.
			for (var i in regions) {
				this.stopMonitoringAndRangingRegion(regions[i], errorCallback);
			}
		},

		stopMonitoringAndRangingRegion: function(region, errorCallback) {
			// Create a region object.
			var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
				region.id,
				region.uuid,
				region.major,
				region.minor);

			// Start ranging.
			cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
				.fail(errorCallback)
				.done();

			// Start monitoring.
			cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
				.fail(errorCallback)
				.done();
		},

		getBeaconId: function(beacon) {
			return beacon.uuid.toUpperCase() + ":" + beacon.major + ":" + beacon.minor;
		},

		isSameBeacon: function(beacon1, beacon2) {
			return this.getBeaconId(beacon1).toUpperCase() === this.getBeaconId(beacon2).toUpperCase();
		},

		isNearerThan: function(beacon1, beacon2) {
			return beacon1.accuracy > 0 && beacon2.accuracy > 0 && beacon1.accuracy < beacon2.accuracy;
		},

		updateNearestBeacon: function(beacons) {
			for (var i = 0; i < beacons.length; i++) {
				var beacon = beacons[i];
				var beaconRegion = this.beaconRegions[this.getBeaconId(beacon)];

				// Round up to 1 decimal place
				beaconRegion.accuracy = Math.round(beacon.accuracy * 10) / 10;
				beaconRegion.proximity = beacon.proximity;
				this.detectedBeacons[beaconRegion.name] = beaconRegion;
			}
		},

		getTrilateration: function(position1, position2, position3) {
			var xa = position1.x;
			var ya = position1.y;
			var xb = position2.x;
			var yb = position2.y;
			var xc = position3.x;
			var yc = position3.y;
			var ra = position1.distance;
			var rb = position2.distance;
			var rc = position3.distance;

			var S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
			var T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
			var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
			var x = ((y * (ya - yb)) - T) / (xb - xa);

			return {
				x: x,
				y: y
			};
		},

		getDirection: function(p1, p2) {
			var delta = {
				x: p2.x - p1.x,
				y: p2.y - p1.y
			};

			// angle in degrees
			var angleDeg = Math.atan2(-delta.x, delta.y) * 180 / Math.PI;
			angleDeg *= -1;

			if (angleDeg < 0) {
				angleDeg += 360;
			}

			return Math.round(angleDeg);
		},

		getPosition: function(data) {
			var count = Object.keys(this.detectedBeacons).length;

			if (count > 2) {
				var xTotal = data[0].XPosition + data[1].XPosition + data[2].XPosition;
				var yTotal = data[0].YPosition + data[1].YPosition + data[2].YPosition;

				if (xTotal + yTotal > 0 && data[2].Accuracy !== -1 && data[1].Accuracy !== -1 && data[0].Accuracy !== -1) {
					var position1 = {
						x: data[0].XPosition,
						y: data[0].YPosition,
						distance: data[0].Accuracy
					};
					var position2;
					var position3;
					if (data[1].XPosition !== data[0].XPosition) {
						position2 = {
							x: data[1].XPosition,
							y: data[1].YPosition,
							distance: data[1].Accuracy
						};
						position3 = {
							x: data[2].XPosition,
							y: data[2].YPosition,
							distance: data[2].Accuracy
						};
					} else {
						position3 = {
							x: data[1].XPosition,
							y: data[1].YPosition,
							distance: data[1].Accuracy
						};
						position2 = {
							x: data[2].XPosition,
							y: data[2].YPosition,
							distance: data[2].Accuracy
						};
					}

					return this.getTrilateration(position1, position2, position3);
				} else {
					return null;
				}
			} else if (count === 2) {
				return null;
			} else {
				return null;
			}
		}
	};

});