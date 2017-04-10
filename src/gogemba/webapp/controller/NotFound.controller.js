sap.ui.define([
	"gogemba/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("gogemba.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("ovewview");
		}

	});

});