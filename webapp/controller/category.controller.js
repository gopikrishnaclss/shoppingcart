sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
  ],
  function (Controller, Fragment, History, JSONModel, Filter, FilterOperator,MessageToast) {
    "use strict";
    return Controller.extend("shoppingcart.controller.category", {
      /**
       * @override
       * @returns {void|undefined}
       * @returns {string}
       */
      onInit: function () {

        this.productList =[]
        // var oData = [
        //   {
        //     "name":"Availability",
        //   },
        //   {
        //     "name":"Price",
        //   },
        //   {
        //     "name":"Supplier"
        //   }
        // ]
        // const oMode = new JSONModel({
        //   data:oData
        // });
        // this.getView().setModel(oMode,"listItems")
        // const oData = this.getView().getModel("product")
        // console.log(oData)
        // const categoryModel = this.getOwnerComponent().getModel("categoryId");
        // const id = categoryModel.getProperty("/id");
        // const catModel = this.getOwnerComponent().getModel("cat");
        // const productList = catModel.getProperty("/productList");
        // const filtered = productList.filter(
        //   (product) => product.categoryId === id
        // );
        // const filteredModel = new sap.ui.model.json.JSONModel({
        //   products: filtered,
        //   title: id,
        // });
        // this.getView().setModel(filteredModel, "product");
      },
      // onBeforeRendering: function() {
      //   var vReturn = Controller.prototype.onBeforeRendering.apply(this, arguments);

      //     const categoryModel = this.getOwnerComponent().getModel("categoryId");
      //   const id = categoryModel.getProperty("/id");

      //   const catModel = this.getOwnerComponent().getModel("cat");
      //   const productList = catModel.getProperty("/productList");

      //   const filtered = productList.filter(
      //     (product) => product.categoryId === id
      //   );

      //   const filteredModel = new sap.ui.model.json.JSONModel({
      //     products: filtered,
      //     title: id,
      //   });

      //   this.getView().setModel(filteredModel, "product");
      //   this.getView().getModel("product").refresh();

      //   return vReturn;
      // },

      onNavBack: function () {
        var detailed = this.getView().byId("detailPanel");
        var carosel = this.getView().byId("carouselPanel");

        detailed.setVisible(false);
        carosel.setVisible(true);

        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("home", {}, true);
        }
      },
      // formatAvailabilityColor: function (status) {
      //   switch (status) {
      //     case "Available":
      //       return "sapUiSuccessText";
      //     case "Out of Stock":
      //       return "sapUiWarningText";
      //     case "Discontinued":
      //       return "sapUiErrorText";
      //     default:
      //       return "";
      //   }
      // },

      onItemSelect(oEvent) {
        let oSelected = oEvent.getParameter("listItem");
        let oContext = oSelected.getBindingContext("product");
        var oSelectedData = oContext.getObject();
        // console.log(oSelectedData);
        let oModel = new JSONModel(oSelectedData);

        this.getView().setModel(oModel, "selectedItem");
        var detailed = this.getView().byId("detailPanel");
        var carosel = this.getView().byId("carouselPanel");

        detailed.setVisible(true);
        carosel.setVisible(false);
      },

      openDialog() {
        const view = this.getView();
        if (!this._oDialog) {
          Fragment.load({
            name: "shoppingcart.fragment.Dialog",
            controller: this,
          }).then((dialog) => {
            this._oDialog = dialog;
            view.addDependent(this._oDialog);
            //this._setDialogModel(data);
            this._oDialog.open();
          });
        } else {
          //this._setDialogModel();
          this._oDialog.open();
        }
      },

      onViewSettingsDialogConfirm(oEvent) {
        const filterItems = oEvent.getParameter("filterItems");
        const filters = [];
        var availableFilter = [];
        var supplier = [];
        var finalFilter = [];
        var aFilter = [];
        filterItems.forEach((item) => {
          filters.push(item.getText());
        });
        let oFilter;
        filters.forEach((each) => {
          switch (each) {
            case "Avaliable":
              oFilter = new Filter(
                "availability",
                FilterOperator.EQ,
                "Available"
              );
              availableFilter.push(oFilter);
              break;
            case "Out of stock":
              oFilter = new Filter(
                "availability",
                FilterOperator.EQ,
                "Out of Stock"
              );
              availableFilter.push(oFilter);
              break;
            default:
              oFilter = new Filter("manufacturer", FilterOperator.EQ, each);
              supplier.push(oFilter);
          }
        });
        if (availableFilter.length > 0) {
          finalFilter.push(
            new Filter({ filters: availableFilter, and: false })
          );
        }
        if (supplier.length > 0) {
          finalFilter.push(new Filter({ filters: supplier, and: false }));
        }
        const list = this.byId("idProductsList");
        const oBinding = list.getBinding("items");
        aFilter = new Filter(new Filter({ filters: finalFilter, and: true }));
        if (finalFilter.length > 0) {
          oBinding.filter(aFilter);
        } else {
          oBinding.filter(null);
        }
      },

      onAddToCartButtonPress() 
      {
        
        const oProduct = this.getView().getModel("selectedItem").getData();
        if (this.productList.includes(oProduct)){
          MessageToast.show("Item is alreay in the cart")
          return
        }
        oProduct.quantity = 1
        oProduct.total=oProduct.price
        this.productList.push(oProduct)
        const oModel = new JSONModel({cart:this.productList})
        this.getOwnerComponent().setModel(oModel,"cartData")
        MessageToast.show(`${oProduct.name} added to cart`)
        
        },
      toCart() {
        let router = this.getOwnerComponent().getRouter()
        router.navTo("RouteCart");
      }
      // priceChange(oEvent) {
      //   const oCustomFilter = sap.ui.getCore().byId("filter");
      //   console.log(oCustomFilter);

      //   const aFilterItems = oCustomFilter.getFilterItems(); // Array of filter items
      //   let oSlider = null;

      //   // Find the slider control inside filter items
      //   for (let i = 0; i < aFilterItems.length; i++) {
      //     const oControl =
      //       aFilterItems[i].getControl && aFilterItems[i].getControl();
      //     if (oControl && oControl.isA("sap.m.Slider")) {
      //       oSlider = oControl;
      //       break;
      //     }
      //   }

      //   if (!oSlider) {
      //     console.error("Slider control not found in filter items.");
      //     return;
      //   }

      //   const iLowValue = oEvent.getParameter("range")[0];
      //   const iHighValue = oEvent.getParameter("range")[1];

      //   if (iLowValue !== oSlider.getMin() || iHighValue !== oSlider.getMax()) {
      //     oCustomFilter.setFilterCount(1);
      //     console.log(oCustomFilter);
      //   } else {
      //     oCustomFilter.setFilterCount(0);
      //   }
      // },
    });
  }
);
