//"use strict";
sap.ui.define(["sap/m/Text"],
	function(Text) {
		"use strict";

		var IssueNumberText = Text
			.extend("gogemba.controls.IssueNumberText", {
				metadata: {
					properties: {
						"count": {
							type: "int",
							group: "Misc",
							defaultValue: 0
						}
					}
				},

				onAfterRendering: function() {
					if (this.getText() === "0") {
						this.getDomRef().style.visibility = "hidden";
					} else {
						this.getDomRef().style.visibility = "visible";
					}

					if (this._styleClass) {
						this.removeStyleClass(this._styleClass);
					}
					var styleClass = this.getCount() === 0 ? "sapGGGreyLabel" : "sapGGRedLabel";
					this.addStyleClass(styleClass);
					this._styleClass = styleClass;
				},

				renderer: {}
			});

		return IssueNumberText;
	}, /* bExport= */ true);