//"use strict";
sap.ui.define(["sap/m/Text"],
	function(Text) {
		"use strict";

		var StatusText = Text
			.extend("gogemba.controls.StatusText", {
				metadata: {
					properties: {
						"status": {
							type: "string",
							group: "Misc",
							defaultValue: null
						}
					}
				},

				onAfterRendering: function() {
					if (this._styleClass) {
						this.removeStyleClass(this._styleClass);
					}
					var styleClass;
					switch (this.getStatus()) {
						case "down":
							styleClass = "sapGGRedLabel";
							break;
						case "running":
							styleClass = "sapGGGreenLabel";
							break;
						default:
							styleClass = "sapGGBlackLabel";
					}

					this.addStyleClass(styleClass);
					this._styleClass = styleClass;
				},

				renderer: {}
			});

		return StatusText;
	}, /* bExport= */ true);