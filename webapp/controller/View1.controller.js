sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter"
], function (Controller, JSONModel, FilterOperator, Filter) {
	"use strict";

	return Controller.extend("test.DragDrop.controller.View1", {
		onInit: function () {
			var data = {
				results: [{
					name: "PSV_from ACF",
					desc: "Pressure relif valve",
					manu: "BrewEquip Manufacturing (INV)",
					nodes: []
				}, {
					name: "20113767",
					desc: "DRAIN SCRUBBER V30001",
					manu: "",
					nodes: []
				}, {
					name: "PSV_Equipment",
					desc: "Pressure relif valve",
					manu: "BrewEquip Manufacturing (INV)",
					nodes: []
				}, {
					name: "SM_FMRA_CHECKLIST",
					desc: "SM_FMEA + Checklist",
					manu: "SAP PoC Manufacturing",
					nodes: []
				}]
			};
			this.getView().setModel(new JSONModel(data), "tableone");
			var datatwo = {
				results: [{
					name: "IAA (IVAR AASEN PLATFORM)",
					nodes: [{
						name: "27_GAS_EXPORT (System 27 - Gas Export)",
						nodes: [{
							name: "2702_COMPRESSION (compression)",
							nodes: []
						}, {
							name: "2701_SCRUBBING (Scrubbing)",
							nodes: [{
								name: "2701_MAIN_SCRUBBING (Main Scrubbing)",
								nodes: [{
									name: "20113764 (DRAIN SCRUBBER VG0001)",
									nodes: []
								}, {
									name: "20113764 (DRAIN SCRUBBER VG0002)",
									nodes: []
								}, {
									name: "20116242 (SWRT TO COMP SUCT COOL)",
									nodes: []
								}, {
									name: "20116235 (TO SWTR RTN MAINF)",
									nodes: []
								}]
							}, {
								name: "2701_PSV_PRESSURE (PSV pressure relief)",
								nodes: []
							}]
						}]
					}]
				}]
			};
			this.getView().setModel(new JSONModel(datatwo), "tabletwo");
		},
		onAfterRendering: function () {
			this.byId("tabletwo").expandToLevel(2);
		},
		onDrop: function (oEvent) {
			var droppedOnSPath = oEvent.getParameter("droppedControl").getBindingContextPath();
			var draggedItemPath = oEvent.getParameter("draggedControl").getBindingContextPath();
			var selectedItemsPath = this.getView().byId("tableone").getSelectedContextPaths();
			var nodes = this.getView().getModel("tabletwo").getProperty(droppedOnSPath + "/nodes");
			
			//Check to se if item draged was one of the items that are selected if the table.
			//If not one of the items, set the dragged item path as the only dragged item.
			//If one of the items. Keep all selected paths
			selectedItemsPath = selectedItemsPath.includes(draggedItemPath) ? selectedItemsPath : [draggedItemPath];
			
			//Add nodes to parent.
			for (var i = 0; i < selectedItemsPath.length; i++) {
				nodes.unshift({
					name: this.getView().getModel("tableone").getProperty(selectedItemsPath[i]).name,
					nodes: []
				});
			}
			this.getView().getModel("tabletwo").setProperty(droppedOnSPath + "/nodes", nodes);
		},
		filter: function (oEvent) {
			this.byId("tableone").getBinding("items").filter(new Filter("name", FilterOperator.Contains, oEvent.getSource().getValue()));
		}
	});
});