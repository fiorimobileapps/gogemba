sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"gogemba/model/models",
	"gogemba/controller/ErrorHandler",
	"gogemba/util/BeaconHelper"
], function(UIComponent, Device, models, ErrorHandler, BeaconHelper) {
	"use strict";

	return UIComponent.extend("gogemba.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");
			// set the json model
			this.setModel(models.createJSONModel());
			this._setWorkCenterData(true);

			// create the views based on the url/hash
			this.getRouter().initialize();

			BeaconHelper.init();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		_setWorkCenterData: function(useCurrentDate) {
			var oJSONModel = this.getModel();

			var now = new Date();
			var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			var jsonToday = "/Date(" + today.getTime() + ")";
			var jsonYesterday = "/Date(" + (today.getTime() - (1000 * 3600 * 24)) + ")";

			var workCentersData = oJSONModel.getData().WorkCenters;
			var workCenter;
			for (var i = 0; i < workCentersData.length; i++) {
				workCenter = workCentersData[i];
				this._setWorkCenterInProcessData(workCenter);
				this._setWorkCenterTotalOperationIssues(workCenter, workCenter.InProcessProductionOrders, useCurrentDate ? jsonToday : null);
				this._setWorkCenterTotalOperationIssues(workCenter, workCenter.QueuingProductionOrders, useCurrentDate ? jsonToday : null);
				this._setWorkCenterTotalOperationIssues(workCenter, workCenter.FinishedProductionOrders, useCurrentDate ? jsonToday : null);

				if (useCurrentDate && workCenter.FinishedProductionOrders.length > 1) {
					var productionOrder = workCenter.FinishedProductionOrders[workCenter.FinishedProductionOrders.length - 1];
					if (productionOrder.MfgOrderPlannedStartDate) {
						productionOrder.MfgOrderPlannedStartDate = jsonYesterday;
					}
					if (productionOrder.MfgOrderActualStartDate) {
						productionOrder.MfgOrderActualStartDate = jsonYesterday;
					}
				}
			}
		},

		_setWorkCenterTotalOperationIssues: function(workCenter, productionOrders, jsonToday) {
			var productionOrder;
			for (var i = 0; i < productionOrders.length; i++) {
				productionOrder = productionOrders[i];

				// For testing only - OperationOnHold field is not available
				if (productionOrder.OperationOnHold === "X") {
					workCenter.TotalOperationOnHold++;
				}

				if (productionOrder.OperationExecutionEndIsLate === "X" || productionOrder.OperationExecutionStartIsLate === "X") {
					workCenter.TotalOperationExecutionIsLate++;
				}

				if (productionOrder.OperationMissingComponents === "X") {
					workCenter.TotalOperationMissingComponents++;
				}

				// For testing only - OperationMissingTools field is not available
				if (productionOrder.OperationMissingTools === "X") {
					workCenter.TotalOperationMissingTools++;
				}

				if (productionOrder.OperationYieldDeviationQty < 0) {
					workCenter.TotalOperationYieldDeviationQty++;
				}

				if (productionOrder.OpScrapQualityIssue === "X") {
					workCenter.TotalOpScrapQualityIssue++;
				}
				if (jsonToday) {
					this._setMfgOrderDate(productionOrder, jsonToday);
				}
			}
		},

		_setWorkCenterInProcessData: function(workCenter) {
			var productionOrder;
			for (var i = 0; i < workCenter.InProcessProductionOrders.length; i++) {
				productionOrder = workCenter.InProcessProductionOrders[i];

				workCenter.InProcessPlannedQuantity += parseInt(productionOrder.MfgOrderPlannedTotalQty, 10);
				workCenter.InProcessActualQuantity += (parseInt(productionOrder.MfgOrderConfirmedYieldQty, 10) + parseInt(productionOrder.MfgOrderConfirmedScrapQty,
					10));
				workCenter.InProcessConfirmedYieldQty += parseInt(productionOrder.MfgOrderConfirmedYieldQty, 10);
				workCenter.InProcessConfirmedScrapQty += parseInt(productionOrder.MfgOrderConfirmedScrapQty, 10);
			}
		},

		_setMfgOrderDate: function(productionOrder, jsonToday) {
			if (productionOrder.MfgOrderPlannedStartDate) {
				productionOrder.MfgOrderPlannedStartDate = jsonToday;
			}
			if (productionOrder.MfgOrderPlannedEndDate) {
				productionOrder.MfgOrderPlannedEndDate = jsonToday;
			}
			if (productionOrder.MfgOrderActualStartDate) {
				productionOrder.MfgOrderActualStartDate = jsonToday;
			}
			if (productionOrder.MfgOrderActualEndDate) {
				productionOrder.MfgOrderActualEndDate = jsonToday;
			}
		}
	});
});