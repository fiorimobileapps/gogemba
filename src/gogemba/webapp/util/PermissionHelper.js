sap.ui.define([], function() {
	"use strict";

	return {
		hasPermission: function(value, successCallback, errorCallback) {
			if (sap.ui.Device.os.android) {
				var permission = cordova.plugins.permissions[value];

				cordova.plugins.permissions.hasPermission(permission, successCallback, errorCallback);
			} else {
				successCallback({
					hasPermission: true
				});
			}
		},

		requestPermission: function(value, successCallback, errorCallback) {
			if (sap.ui.Device.os.android) {
				var permission = cordova.plugins.permissions[value];

				cordova.plugins.permissions.requestPermission(permission, successCallback, errorCallback);
			} else {
				successCallback({
					hasPermission: true
				});
			}
		},

		requestPermissions: function(values, successCallback, errorCallback) {
			if (sap.ui.Device.os.android) {
				var permissions = [];

				for (var i = 0; i < values.length; i++) {
					permissions.push(cordova.plugins.permissions[values[i]]);
				}

				cordova.plugins.permissions.requestPermissions(permissions, successCallback, errorCallback);
			} else {
				successCallback({
					hasPermission: true
				});
			}
		},

		requestPermissionError: function(oEvent) {
			jQuery.sap.log.error("No permission");
		}
	};
});