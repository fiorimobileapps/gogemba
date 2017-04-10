sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(DateFormat) {
	"use strict";

	return {
		
		getDateTime: function(value) {
			if (!value) {
				return "";
			}

			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oDisplayDateFormat = DateFormat.getDateInstance(oLocale);

			var oTimeFormat = this._getTimeFormat();
			return oDisplayDateFormat.format(value) + " " + oTimeFormat.format(value);
		},
		
		formatTime: function(value) {
			if (!value) {
				return "";
			}
			var hours, minutes, seconds;
			if (typeof value.ms === "number") {
				// TODO : The time is not yet supported by oData and ms is always 0. We should use Plant time instead of local time
				var date = new Date(value.ms);
				var dateTime = new Date(date.getTime());

				hours = dateTime.getHours();
				minutes = dateTime.getMinutes();
				seconds = dateTime.getSeconds();

				return "";
			} else {
				hours = value.substring(2, 4) * 1;
				minutes = value.substring(5, 7) * 1;
				seconds = value.substring(8, 10) * 1;
			}

			var oDate = new Date();
			oDate.setHours(hours, minutes, seconds, 0);
			var oDate2 = new Date();
			var str = "";

			// TODO : Should get the Plant time - hardcode the time to 11am for demo only
			oDate2.setHours(11, 0, 0, 0);
			var diff = [];
			if (oDate2 >= oDate) {
				diff = this._getTimeDiff(oDate2, oDate);
				if (diff[0] >= 1) {
					return diff[0] === 1 ? "1 week ago" : diff[0] + " weeks ago";
				} else {
					if (diff[1] >= 1) {
						return diff[1] === 1 ? "1 day ago" : diff[1] + " days ago";
					} else {
						if (diff[2] >= 1) {
							if (diff[3] === 0) {
								return diff[2] === 1 ? "1 hour ago" : diff[2] + " hours ago";
							} else {
								if (diff[2] > 0) {
									str += diff[2] === 1 ? "1 hour " : diff[2] + " hours ";
								}
								if (diff[3] === 1) {
									str = str + " 1 minute ago";
								} else {
									str = str + diff[3] + " minutes ago";
								}
								return str;
							}
						} else {
							return diff[3] === 1 ? "1 minute ago" : diff[3] + " minutes ago";
						}
					}
				}

			} else {
				str = "in ";
				diff = this._getTimeDiff(oDate, oDate2);
				if (diff[0] >= 1) {
					return diff[0] === 1 ? "in 1 week" : "in " + diff[0] + " weeks";
				} else {
					if (diff[1] >= 1) {
						return diff[1] === 1 ? +"in 1 day" : "in " + diff[1] + " days";
					} else {
						if (diff[2] >= 1) {
							if (diff[3] === 0) {
								return diff[2] === 1 ? "in 1 hour " : "in " + diff[2] + " hours ";
							} else {
								if (diff[2] > 0) {
									str += diff[2] === 1 ? "1 hour " : diff[2] + " hours ";
								}
								if (diff[3] === 1) {
									str = str + " 1 minute";
								} else {
									str = str + diff[3] + " minutes";
								}
								return str;
							}
						} else {
							return diff[3] === 1 ? "in 1 minute" : "in " + diff[3] + " minutes";
						}
					}
				}
			}
		},

		formatDateTime: function(date, time) {
			var startDate = this._parseJsonDate(date);
			if (!time) {
				return "";
			}

			var hours, minutes, seconds;
			if (typeof time.ms === "number") {
				// TODO : The time is not yet supported by oData and ms is always 0. We should use Plant time instead of local time
				var date = new Date(time.ms);
				var timeInMs = date.getTime();
				var TZOffsetMS = new Date(0).getTimezoneOffset() * 60 * 100;
				var dateTime = new Date(timeInMs + TZOffsetMS);

				hours = dateTime.getHours();
				minutes = dateTime.getMinutes();
				seconds = dateTime.getSeconds();

				return "";
			} else {
				hours = time.substring(2, 4) * 1;
				minutes = time.substring(5, 7) * 1;
				seconds = time.substring(8, 10) * 1;
			}
			startDate.setHours(hours, minutes, seconds, 0);

			var oDate2 = new Date();

			// TODO : Should get the Plant time - hardcode the time to 11am for demo only
			oDate2.setHours(11, 0, 0, 0);

			var diff = this._getTimeDiff(oDate2, startDate);
			var isYesterday = new Date().getHours() - diff[2] < 0 ? true : false;
			var str = "";
			if (diff[1] === 0 && isYesterday === false) {
				if (diff[3] === 0) {
					return diff[2] === 1 ? "1 hour ago" : diff[2] + " hours ago";
				} else {
					if (diff[2] > 0) {
						str += diff[2] === 1 ? "1 hour " : diff[2] + " hours ";
					}
					if (diff[3] === 1) {
						str = str + "1 minute ago";
					} else {
						str = str + diff[3] + " minutes ago";
					}
					return str;
				}
			} else if (diff[1] === 1 || isYesterday) {
				return "Yesterday " + this._getformatedTime(startDate);
			} else {
				return this._getTimeDiff(startDate);
			}
		},
		
		_getformatedTime: function(value) {
			if (!value) {
				return "";
			}
			var oTimeFormat = this._getTimeFormat();
			return oTimeFormat.format(value);
		},
		
		_getTimeFormat: function() {
			return sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HH:mm"
			});
		},

		_parseJsonDate: function(value) {
			if (!value) {
				return "";
			}
			return new Date(new Number(value.match(/\d+/g).join([])));
		},
		
		_getTimeDiff: function(date2, date) {
			var duration, totalmi, ws, ds, hr, mi = 0;
			duration = date2.getTime() - date.getTime();
			totalmi = duration / 60000;

			hr = Math.floor(totalmi / 60);
			mi = Math.floor(totalmi % 60);
			ds = Math.floor(hr / 24);
			ws = Math.floor(ds / 7);
			return [ws, ds, hr, mi];
		},
	
	};

});