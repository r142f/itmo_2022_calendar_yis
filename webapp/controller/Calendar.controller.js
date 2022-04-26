sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	'sap/ui/unified/library',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/library',
	'sap/ui/model/xml/XMLModel'
], function(Controller, CalendarLegendItem, DateTypeRange, unifiedLibrary, JSONModel, DateFormat, coreLibrary, XMLModel) {
	"use strict";

	var CalendarDayType = unifiedLibrary.CalendarDayType;
	var CalendarType = coreLibrary.CalendarType;

	return Controller.extend("itmo_2022_calendar_yis.controller.Calendar", {
		oFormatYyyymmdd: null,
		oModel: null,
		xmlCalendar: null,
		holidays: [],
		typeToColor: {
			1: '#D8E2DC',
			2: '#F8EDEB',
			3: '#FEC5BB',
			4: '#FFD7BA'
		},
		typeToType: {
			1: CalendarDayType.Type01,
			2: CalendarDayType.Type02,
			3: CalendarDayType.Type03,
			4: CalendarDayType.Type04
		},
		typeToText: {
			1: 'Государственный праздник',
			2: 'Рабочий и сокращенный день',
			3: 'Рабочий день (суббота/воскресенье)',
			4: 'Дополнительный выходной день'
		},

		onInit: function() {
			this.oFormatYyyymmdd = DateFormat.getInstance({
				pattern: "yyyy-MM-dd",
				calendarType: CalendarType.Gregorian
			});
			this.oModel = new JSONModel({
				selectedDates: []
			});
			this.getView().setModel(this.oModel);

			var oModelX = new XMLModel();
			oModelX.attachRequestCompleted(function() {
				var xmlStr = oModelX.getXML();
				var oParser = new DOMParser();
				this.xmlCalendar = oParser.parseFromString(xmlStr, "application/xml");

				var days = this.xmlCalendar.querySelectorAll('day');
				for (var j = 0; j < days.length; ++j) {
					var day = days[j];
					var type = day.getAttribute('t');
					var date = day.getAttribute('d');

					var holiday = this.xmlCalendar.querySelector('*[id="' + day.getAttribute('h') + '"]');
					var id = undefined,
						title = undefined;

					if (holiday) {
						id = holiday.getAttribute('id');
						title = holiday.getAttribute('title');
					} else if (type === '1') {
						type = '4';
					}
					this.holidays.push({
						id: id,
						title: title || this.typeToText[type],
						type: type,
						date: date
					});
				}

				var oCal = this.byId("calendar"),
					oLeg = this.byId("legend");

				for (var i = 1; i <= this.holidays.length; i++) {
					holiday = this.holidays[i - 1];

					oCal.addSpecialDate(new DateTypeRange({
						startDate: new Date(holiday.date + ".2022"),
						type: "Type0" + holiday.type,
						tooltip: holiday.title
					}));
				}

				for (var k = 1; k <= Object.keys(this.typeToText).length; ++k) {
					var text = this.typeToText[k];
					var color = this.typeToColor[k];
					type = this.typeToType[k];

					oLeg.addItem(new CalendarLegendItem({
						text: text,
						color: color,
						type: type
					}));

				}
			}.bind(this));
			oModelX.loadData("../calendar.xml");
		},

		handleCalendarSelect: function(oEvent) {
			var oCalendar = oEvent.getSource(),
				aSelectedDates = oCalendar.getSelectedDates(),
				oData = {
					selectedDates: []
				},
				oDate,
				i;

			if (aSelectedDates.length > 0) {
				for (i = 0; i < aSelectedDates.length; i++) {
					oDate = aSelectedDates[i].getStartDate();
					oData.selectedDates.push({
						Date: this.oFormatYyyymmdd.format(oDate)
					});
				}
				this.oModel.setData(oData);
			} else {
				this._clearModel();
			}
		},

		handleRemoveSelection: function() {
			this.byId("calendar").removeAllSelectedDates();
			this._clearModel();
		},

		_clearModel: function() {
			var oData = {
				selectedDates: []
			};
			this.oModel.setData(oData);
		}
	});

});
