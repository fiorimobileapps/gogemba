sap.ui.define([
	"gogemba/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"gogemba/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"gogemba/util/BeaconHelper"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History, BeaconHelper) {
	"use strict";

	return BaseController.extend("gogemba.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update

		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		onExit: function() {
			this.stopTimer();
		},

		onBeforeShow: function() {
			if (!sap.ui.Device.system.desktop) {
				var ms = 1000;

				// Set a timer to refresh Beacon distance & direction
				this._displayTimer = setInterval(jQuery.proxy(function() {
					this._refreshList();
				}, this), ms);
			}
		},

		_stopTimer: function() {
			if (this._displayTimer) {
				// Stop timer before go to next page
				clearInterval(this._displayTimer);
				this._displayTimer = null;
			}
		},

		handleSelectionChange: function() {
			this._stopTimer();

			var list = this.getView().byId("list");
			var item = list.getSelectedItem();

			var oModel = this.getModel();

			var oDetailModel = this.getModel("detail");
			oDetailModel.setData([oModel.getProperty(item.getBindingContext().getPath())]);

			var oData = oDetailModel.getData();
			var oInProcessOrdersModel = this.getModel("inProcessOrders");
			oInProcessOrdersModel.setData(oData[0].InProcessProductionOrders);

			var oInQueueOrdersModel = this.getModel("inQueueOrders");
			oInQueueOrdersModel.setData(oData[0].QueuingProductionOrders);

			var oFinishedOrdersModel = this.getModel("finishedOrders");
			oFinishedOrdersModel.setData(oData[0].FinishedProductionOrders);

			// We want to select same item again 
			list.removeSelections(true);

			this.getRouter().navTo("detail");
		},

		_refreshList: function() {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			for (var i = 0; i < oData.WorkCenters.length; i++) {
				var workCenter = oData.WorkCenters[i];
				if (!sap.ui.Device.system.desktop) {
					if (BeaconHelper.detectedBeacons[workCenter.WorkCenter]) {
						var beacon = BeaconHelper.detectedBeacons[workCenter.WorkCenter];
						workCenter.Accuracy = beacon.accuracy;
						workCenter.Proximity = beacon.proximity;
						workCenter.XPosition = beacon.xPosition;
						workCenter.YPosition = beacon.yPosition;
					}
				}
			}

			var data = oModel.getData().WorkCenters;
			if (data) {
				var beaconDetected = false;
				for (i in data) {
					if (data[i].Accuracy !== -1) {
						beaconDetected = true;
						break;
					}
				}

				if (beaconDetected) {
					var originalData = data.slice(0);

					data.sort(function(a, b) {
						if (a.Accuracy === -1 && b.Accuracy === -1) {
							return 0;
						} else if (a.Accuracy === -1) {
							return 100 - b.Accuracy;
						} else if (b.Accuracy === -1) {
							return a.Accuracy - 100;
						} else {
							return a.Accuracy - b.Accuracy;
						}
					});

					var orderChanged = false;
					for (i in originalData) {
						if ((originalData[i].Accuracy !== 1) && (originalData[i].WorkCenter !== data[i].WorkCenter)) {
							orderChanged = true;
							break;
						}
					}

					if (orderChanged) {
						// Refresh the list
						oModel.refresh(false);
					} else {
						// Refresh the distance & direction only
						this._refreshItems();
					}
				}
			}
		},

		_refreshItems: function() {
			var oModel = this.getModel();
			var data = oModel.getData().WorkCenters;

			var list = this.getView().byId("list");
			var items = list.getItems();

			for (var i = 0; i < items.length; i++) {
				var content = items[i].getContent()[0];
				var firstPanel = content.getItems()[0];
				var innerPanel = firstPanel.getItems()[1];
				var accuracy = innerPanel.getItems()[0];
				accuracy.setText(formatter.getAccuracy(data[i].Accuracy));
			}
		},

		_updateWorkCenterTotalOperationIssues: function(workCenter, productionOrder) {
			if (productionOrder.OperationExecutionEndIsLate === "X" || productionOrder.OperationExecutionStartIsLate === "X") {
				workCenter.TotalOperationExecutionIsLate++;
			}

			if (productionOrder.OperationMissingComponents === "X") {
				workCenter.TotalOperationMissingComponents++;
			}

			if (productionOrder.OperationYieldDeviationQty < 0) {
				workCenter.TotalOperationYieldDeviationQty++;
			}

			if (productionOrder.OpScrapQualityIssue === "X") {
				workCenter.TotalOpScrapQualityIssue++;
			}
		}
	});
});