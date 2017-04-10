sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat",
	'gogemba/util/DateTimeFormatterHelper'
], function(NumberFormat, DateFormat, DateTimeFormatterHelper) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		getAccuracy: function(value) {
			if (value === null || value === -1) {
				return "";
			} else {
				return value + "m";
			}
		},

		getNumber: function(value) {
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oLocale);
			return oNumberFormat.format(value);
		},

		

		getProgress: function(confirmedYieldQty, plannedTotalQty) {
			if (plannedTotalQty && plannedTotalQty !== 0) {
				if (confirmedYieldQty >= plannedTotalQty) {
					return 100;
				} else {
					return Math.round((confirmedYieldQty / plannedTotalQty) * 100);
				}
			} else {
				return 0;
			}
		},

		getIssueIconColor: function(value) {
			return value === 0 || value === "false" ? "grey" : "#CC0000";
		},

		getIconColor: function(value, status) {
			if (typeof value === "number") {
				if (status && status === "Submitted") {
					return "grey";
				} else if (value < 0) {
					return "#CC0000";
				} else {
					return "grey";
				}
			} else {
				if (status && status === "Submitted") {
					return "grey";
				} else if (value === "X") {
					return "#CC0000";
				} else {
					return "grey";
				}
			}
		},

		getIconColor2: function(executionEndIsLate, executionStartIsLate, status) {
			if (status && status === "Submitted") {
				return "grey";
			} else if (executionEndIsLate === "X" || executionStartIsLate === "X") {
				return "#CC0000";
			} else {
				return "grey";
			}
		},

		getIconColor3: function(status) {
			if (status && status === "Submitted") {
				return "grey";
			} else {
				return "#CC0000";
			}
		},

		getNotificationIDText: function(value) {
			return value ? this.getModel("i18n").getResourceBundle().getText("notificationID") + ": " + value : "";
		},
		
		
		getDateTime: function(value) {
			return DateTimeFormatterHelper.getDateTime(value);
		},

		formatTime: function(value) {
			return DateTimeFormatterHelper.formatTime(value);
		},

		formatDateTime: function(date, time) {
			return DateTimeFormatterHelper.formatDateTime(date, time);
		},

		getIssueTitle: function(value) {
			var title;
			var oResourceBundle = this.getModel("i18n").getResourceBundle();
			switch (value) {
				case "OperationOnHold":
					title = oResourceBundle.getText("operationOnHold");
					break;
				case "OperationExecutionIsLate":
					title = oResourceBundle.getText("operationDelayed");
					break;
				case "OperationMissingComponents":
					title = oResourceBundle.getText("componentsMissing");
					break;
				case "OperationMissingTools":
					title = oResourceBundle.getText("toolsMissing");
					break;
				case "OperationYieldDeviationQty":
					title = oResourceBundle.getText("quantityDeviation");
					break;
				case "OpScrapQualityIssue":
					title = oResourceBundle.getText("qualityDeviation");
					break;
				default:
					title = "";
					break;
			}
			return title;
		},

		getIssueIcon: function(value) {
			var image;
			switch (value) {
				case "OperationOnHold":
					image = "sap-icon://status-error";
					break;
				case "OperationExecutionIsLate":
					image = "sap-icon://history";
					break;
				case "OperationMissingComponents":
					image = "sap-icon://tree";
					break;
				case "OperationMissingTools":
					image = "sap-icon://wrench";
					break;
				case "OperationYieldDeviationQty":
					image = "sap-icon://dimension";
					break;
				case "OpScrapQualityIssue":
					image = "sap-icon://quality-issue";
					break;
				default:
					image = "sap-icon://settings";
					break;
			}
			return image;
		},

		showIssues: function(len) {
			if (len > 0) { //status for display icon color
				return true;
			} else {
				return false;
			}
		}
	};

});