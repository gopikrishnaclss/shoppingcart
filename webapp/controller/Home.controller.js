sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("shoppingcart.controller.Home", {
      /**
       * @override
       * @returns {void|undefined}
       */
      onInit: function () {
        const catModel = this.getOwnerComponent().getModel("cat");
        const productList = catModel.getProperty("/productList");
        const filtered = productList.filter(
          (product) => product.categoryId === "Accessories"
        );
        const filteredModel = new JSONModel({
          products: filtered,
        });

        this.getOwnerComponent().setModel(filteredModel, "HomeList");
        console.log(
          this.getOwnerComponent().getModel("HomeList").getProperty("/products")
        );
      },
      onAfterRendering: function () {
        if (!this._autoScrollStarted) {
          this.startAutoScroll();
          this._autoScrollStarted = true;
        }
      },

      startAutoScroll: function () {
        var oCarousel = this.byId("imageCarousel");
        if (!oCarousel) {
          console.error("Carousel control not found");
          return;
        }

        var iTotalPages = oCarousel.getPages().length;
        var iCurrentPage = 0;

        this._autoScrollInterval = setInterval(function () {
          iCurrentPage = (iCurrentPage + 1) % iTotalPages;
          var oPage = oCarousel.getPages()[iCurrentPage];
          oCarousel.setActivePage(oPage);
        }, 3000);
      },

      onExit: function () {
        if (this._autoScrollInterval) {
          clearInterval(this._autoScrollInterval);
        }
      },

      cartButton() {
        let router = this.getOwnerComponent().getRouter();
        router.navTo("RouteCart");
      },

      statusClass: function (sStatus) {
        return sStatus === "Available" ? "Success" : "outOfStockText";
      },

      navProducts(oEvent){
        //  alert("dfd") 
        // var oListItem = oEvent.getSource();
        //  var oContext = oListItem.getBindingContext("cat");
        //  var sCategoryId = oContext.getProperty("id");
        // console.log(categoryId)
        // const sCategoryId = oEvent.getParameter("arguments").categoryId;
        const catModel = this.getOwnerComponent().getModel("cat");
        const productList = catModel.getProperty("/productList");

        const filtered = productList.filter(
          (product) => product.categoryId === "Accessories"
        );

        const filteredModel = new JSONModel({
          products: filtered,
          title: "Accessories",
        });

        this.getOwnerComponent().setModel(filteredModel, "product");
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteCategory");
      }
    });
  }
);
