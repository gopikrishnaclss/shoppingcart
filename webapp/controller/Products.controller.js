sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("shoppingcart.controller.Products", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteCategory")
          .attachPatternMatched(this._onCategoryMatched, this);
      },
      onSearch() {
        let view = this.getView();
        let searchField = view.byId("searchField");
        let productList = view.byId("productList");
        let categoryList = view.byId("categoryList");
        let searchValue = searchField.getValue().length !== 0;

        categoryList.setVisible(!searchValue);
        productList.setVisible(searchValue);

        let oData = productList.getBinding("items");

        if (oData) {
          if (searchValue) {
            let filteredData = new Filter({
              path: "name",
              operator: FilterOperator.Contains,
              value1: searchField.getValue(),
            });

            oData.filter([filteredData]);
          }
        }
      },

      select: function (oEvent) {
         var oListItem = oEvent.getSource();
         var oContext = oListItem.getBindingContext("cat");
         var sCategoryId = oContext.getProperty("id");
        // console.log(categoryId)
        // const sCategoryId = oEvent.getParameter("arguments").categoryId;
        const catModel = this.getOwnerComponent().getModel("cat");
        const productList = catModel.getProperty("/productList");

        const filtered = productList.filter(
          (product) => product.categoryId === sCategoryId
        );

        const filteredModel = new JSONModel({
          products: filtered,
          title: sCategoryId,
        });

        this.getOwnerComponent().setModel(filteredModel, "product");
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteCategory");
      },
    });
  }
);
