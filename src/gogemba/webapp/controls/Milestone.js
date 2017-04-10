//"use strict";
sap.ui.define(["sap/ui/core/Control"],
	function(Control) {
		"use strict";

		var Milestone = Control
			.extend("gogemba.controls.Milestone", {

					metadata: {
						properties: {
							value: {
								type: "string",
								defaultValue: ""
							},
							size: {
								type: "sap.ui.core.CSSSize",
								defaultValue: "24px"
							}
						},
						aggregations: {
							layout: {
								type: "sap.ui.layout.HorizontalLayout",
								hidden: true,
								multiple: false
							}
						}
					},

					init: function() {
						this.STEPS = 3;
						this.OperationIsReleasedIcon = new sap.ui.core.Icon({
							src: "sap-icon://accept",
							useIconTooltip: false,
							size: "0.8rem"
						});
						this.OperationIsDelayedIcon = new sap.ui.core.Icon({
							src: "sap-icon://lateness",
							useIconTooltip: false,
							size: "0.8rem"
						});
						this.OperationIsFinishedIcon = new sap.ui.core.Icon({
							src: "sap-icon://notification",
							useIconTooltip: false,
							size: "1.5rem"
						});
						this.setAggregation("layout", new sap.ui.layout.HorizontalLayout());
					},

					addContent: function(oStatus) {
						return this.getAggregation("layout").addContent(oStatus);
					},

					removeContent: function(oStatus) {
						return this.getAggregation("layout").removeContent(oStatus);
					},

					destroyContent: function(oStatus) {
						return this.getAggregation("layout").destroyContent(oStatus);
					},

					indexOfContent: function(oStatus) {
						return this.getAggregation("layout").indexOfContent(oStatus);
					},

					removeAllContent: function() {
						return this.getAggregation("layout").removeAllContent();
					},

					onAfterRendering: function() {

					},

					onBeforeRendering: function() {

					},

					renderer: function(oRm, oControl) {
						// Supported Status - Created, Released, Partially Confirm, Confirm
						// Demo Status - Delayed, OnHold, Overdue

						var status = oControl.getValue() || "Created";

						oRm.write("<div");
						oRm.writeControlData(oControl);
						oRm.write(">");
						oRm.renderControl(oControl.getAggregation("layout"));

						for (var i = 0; i < oControl.STEPS; i++) {
							oRm.write("<div");
							oRm.writeControlData(oControl);

							oRm.addStyle("width", oControl.getSize());
							oRm.addStyle("height", oControl.getSize());
							oRm.writeStyles();
							oRm.addClass("sapGGStatusInactive");
							oRm.writeClasses();
							oRm.write(">");

							if (i === 0) {
								if (status !== "Created") {
									oRm.write("<div id='");
									oRm.writeEscaped(oControl.getId());
									oRm.write(" 'class='sapGGIconIsReleased'>");
									oControl.OperationIsReleasedIcon.addStyleClass("sapGGIconAlignment");
									oRm.renderControl(oControl.OperationIsReleasedIcon);
									oRm.write("</div>");
								}
							}
							if (i === 1) {
								if (status.indexOf("Confirmed") > -1 || status === "OnHold" || status === "Overdue") {
									oRm.write("<div id='");
									oRm.writeEscaped(oControl.getId());
									oRm.write(" 'class='sapGGIconIsReleased'>");
									oControl.OperationIsReleasedIcon.addStyleClass("sapGGIconAlignment");
									oRm.renderControl(oControl.OperationIsReleasedIcon);
									oRm.write("</div>");
								}
								if (status === "Delayed") {
									oRm.write("<div id='");
									oRm.writeEscaped(oControl.getId());
									oRm.write(" 'class='sapGGIconIsDelayed'>");
									oControl.OperationIsDelayedIcon.addStyleClass("sapGGIconAlignment");
									oRm.renderControl(oControl.OperationIsDelayedIcon);
									oRm.write("</div>");
								}
							}
							if (i === 2) {
								if (status === "Confirmed") {
									oRm.write("<div id='");
									oRm.writeEscaped(oControl.getId());
									oRm.write(" 'class='sapGGIconIsReleased'>");
									oControl.OperationIsReleasedIcon.addStyleClass("sapGGIconAlignment");
									oRm.renderControl(oControl.OperationIsReleasedIcon);
									oRm.write("</div>");
								}
								if (status === "Overdue") {
									oRm.write("<div id='");
									oRm.writeEscaped(oControl.getId());
									oRm.write(" 'class='sapGGIconIsFinished'>");
									oControl.OperationIsFinishedIcon.addStyleClass("sapGGIconAlignment");
									oRm.renderControl(oControl.OperationIsFinishedIcon);
									oRm.write("</div>");
								}
							}

							oRm.write("</div>");

							if (i < oControl.STEPS - 1) {
								oRm.write("<div");
								oRm.writeControlData(oControl);
								oRm.addStyle("width", "8px");
								oRm.addStyle("height", "8px");
								oRm.writeStyles();
								oRm.addClass("sapGGStatusConnectLine");
								oRm.writeClasses();
								oRm.write(">");
								if (i === 1 && (status === "OnHold" || status === "Overdue")) {
									oRm.write("<div");
									oRm.writeControlData(oControl);
									oRm.addStyle("width", "4px");
									oRm.addStyle("height", "24px");
									oRm.writeStyles();
									oRm.addClass("sapGGStatusVerticalLine");
									oRm.writeClasses();
									oRm.write(">");
									oRm.write("</div>");
								}
								oRm.write("</div>");
							}
						}
						oRm.write("</div>");

					}
				}

			);

		return Milestone;
	}, /* bExport= */ true);