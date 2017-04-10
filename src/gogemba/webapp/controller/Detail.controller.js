/*global location*/
sap.ui.define([
	"gogemba/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"gogemba/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";

	return BaseController.extend("gogemba.controller.Detail", {

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
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			this._scrollToTop();

			this.myNavBack("overview");
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		onBeforeShow: function(evt) {
			if (evt.direction === "to") {
				var oDetailModel = this.getModel("detail");
				oDetailModel.refresh(true);

				var oInProcessOrdersModel = this.getModel("inProcessOrders");
				oInProcessOrdersModel.refresh(true);

				var oInQueueOrdersModel = this.getModel("inQueueOrders");
				oInQueueOrdersModel.refresh(true);

				var oFinishedOrdersModel = this.getModel("finishedOrders");
				oFinishedOrdersModel.refresh(true);
			}
		},

		_scrollToTop: function(evt) {
			// Scroll to top
			var oObjectPageLayout = this.getView().byId("ObjectPageLayout");
			var scrollDelegate = oObjectPageLayout.getScrollDelegate();
			if (scrollDelegate) {
				jQuery.sap.delayedCall(100, scrollDelegate, scrollDelegate.scrollTo, [0, 0]);
			}
		},

		handleIssueIconPress: function(evt) {
		},

		_getIssuesData: function(data, orderID) {
			for (var item in data) {
				if (orderID === data[item].ManufacturingOrder) {
					return data[item].OperationIssues;
				}
			}
		}
	});
});