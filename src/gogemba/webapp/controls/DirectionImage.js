//"use strict";
sap.ui.define(["sap/m/Image"],
	function(Image) {
		"use strict";

		var DirectionImage = Image
			.extend("gogemba.controls.DirectionImage", {
					metadata: {
						properties: {
							direction: {
								type: "int",
								defaultValue: 0
							},
							enabled: {
								type: "boolean",
								defaultValue: false
							}
						}
					},

					onAfterRendering: function() {
						var image = this.getEnabled() ? "direction.png" : "no_direction.png";
						var path = jQuery.sap.getModulePath("gogemba") + "/images/" + image;
						this.setSrc(path);
						$("#" + this.getId())[0].style["-webkit-transform"] = "rotate(" + this.getDirection() + "deg)";
						$("#" + this.getId())[0].style["-ms-transform"] = "rotate(" + this.getDirection() + "deg)";
						$("#" + this.getId())[0].style["transform"] = "rotate(" + this.getDirection() + "deg)";
					},

					renderer: {}
				}

			);

		return DirectionImage;
	}, /* bExport= */ true);