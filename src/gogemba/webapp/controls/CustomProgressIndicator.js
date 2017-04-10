//"use strict";
sap.ui.define(["sap/m/ProgressIndicator"],
	function(ProgressIndicator) {
		"use strict";

		var CustomProgressIndicator = ProgressIndicator
			.extend("gogemba.controls.CustomProgressIndicator", {
				metadata: {
					properties: {
						"actual": {
							type: "int",
							defaultValue: 0
						},
						"planned": {
							type: "int",
							defaultValue: 0
						},
						"scrap": {
							type: "int",
							defaultValue: 0
						},
						"type": {
							type: "string",
							group: "Misc",
							defaultValue: "planned"
						}
					}
				},

				getCustomStyle: function() {
					var value, styleClass;
					var actual = this.getActual();
					var planned = this.getPlanned();
					if (this.getType().toLowerCase() === "actual") {
						if (actual >= planned) {
							styleClass = "sapGGProgressIndicatorActualGreen";
							value = 100;
						} else {
							styleClass = "sapGGProgressIndicatorActualRed";
							value = 100 - ((planned - actual) / planned) * 100;
						}
					} else if (this.getType().toLowerCase() === "planned") {
						if (actual <= planned) {
							value = 100;
						} else {
							value = 100 - ((actual - planned) / actual) * 100;
						}
						styleClass = "sapGGOverviewPageProgressIndicatorPlanned";
						this._styleClass = styleClass;
					} else { //scrap
						var scrap = this.getScrap();
						styleClass = "sapGGProgressIndicatorActualRed";
						value = 100 - ((planned - scrap) / planned) * 100;
					}

					this.setPercentValue(value);
					return styleClass;
				},

				renderer: function(oRm, oC) {
					var styleClass = oC.getCustomStyle();
					var fWidthBar = oC.getPercentValue(),
						iWidthControl = oC.getWidth(),
						iHeightControl = oC.getHeight(),
						sTextValue = oC.getDisplayValue(),
						bShowText = oC.getShowValue(),
						sControlId = oC.getId();

					// write the HTML into the render manager
					// PI border
					oRm.write("<div");
					oRm.writeControlData(oC);
					oRm.addClass("sapMPI");
					oRm.addClass(styleClass);
					oRm.addStyle("width", iWidthControl);

					if (fWidthBar > 50) {
						oRm.addClass("sapMPIValueGreaterHalf");
					}
					if (iHeightControl) {
						oRm.addStyle("height", iHeightControl);
					}

					if (oC.getEnabled()) {
						oRm.writeAttribute("tabIndex", "-1");
					} else {
						oRm.addClass("sapMPIBarDisabled");
					}
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.writeAccessibilityState(oC, {
						role: "progressbar",
						valuemin: 0,
						valuenow: fWidthBar,
						valuemax: 100,
						valuetext: oC._getAriaValueText({
							sText: sTextValue,
							fPercent: fWidthBar
						})
					});
					oRm.write(">"); // div element

					// PI bar
					oRm.write("<div");
					oRm.addClass("sapMPIBar");
					oRm.addClass("sapGGProgressBar");
					oRm.writeClasses();
					oRm.writeAttribute("id", sControlId + "-bar");
					oRm.writeAttribute("style", "width:" + fWidthBar + "%");
					oRm.write(">"); // div element
					//textvalue is only showed if showValue set
					if (bShowText) {
						oRm.writeEscaped(sTextValue);
					}
					oRm.write("</span>");
					oRm.write("</div>"); // div element pi bar
					//textvalue is only showed if showValue set
					if (bShowText) {
						oRm.writeEscaped(sTextValue);
					}

					oRm.write("</span>");
					oRm.write("</div>"); //div element pi text
				}
			});

		return CustomProgressIndicator;
	}, /* bExport= */ true);