sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
	"sap/m/Tile",
  ],

  function (Controller,
	History,
	Dialog,
	Button,
	ButtonType,
	List,
	Tile) {
    "use strict";

    return Controller.extend("shoppingcart.controller.Cart", {
      /**
       * @override
       * @returns {void|undefined}
       */
      onInit: function () {
        //     console.log("fghh")

        const oCartModel = this.getOwnerComponent().getModel("cartData");

        const aCartItems = oCartModel ? oCartModel.getProperty("/cart") : [];

        const oVBoxEmpty = this.getView().byId("cartEmpty");
        const oVBoxCart = this.getView().byId("cart2");

        const bHasItems = Array.isArray(aCartItems) && aCartItems.length > 0;

        oVBoxEmpty.setVisible(!bHasItems);
        oVBoxCart.setVisible(bHasItems);

        //   console.log(oData.oData)
      },
      navBack() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("home", {}, true);
        }
      },
      onDecreaseQuantity(oEvent) {
        var oButton = oEvent.getSource();
        var oContext = oButton.getBindingContext("cartData");

        var oItem = oContext.getObject();
        // console.log(oItem)

        if (oItem.quantity > 1) {
          let newQuantity = oItem.quantity - 1;
          let newTotal = oItem.price * newQuantity;
          let path = oContext.getPath();

          oContext.getModel().setProperty(path + "/quantity", newQuantity);
          oContext.getModel().setProperty(path + "/total", newTotal);
        }
      },

      onIncreaseQuantity(oEvent) {
        var oButton = oEvent.getSource();
        var oContext = oButton.getBindingContext("cartData");
        var oItem = oContext.getObject();
        let newQuantity = oItem.quantity + 1;
        let newTotal = oItem.price * newQuantity;
        let path = oContext.getPath();
        oContext.getModel().setProperty(path + "/quantity", newQuantity);
        oContext.getModel().setProperty(path + "/total", newTotal);
      },
      removeButton(oEvent) {
        var oButton = oEvent.getSource();
        let oContext = oButton.getBindingContext("cartData");
        var path = oContext.getPath();
        var index = parseInt(path.split("/").pop());
        var model = oContext.getModel();
        var data = model.getProperty("/cart");
        data.splice(index, 1);

        if (data.length === 0) {
          const oVBoxEmpty = this.getView().byId("cartEmpty");
          const oVBoxCart = this.getView().byId("cart2");

          oVBoxEmpty.setVisible(true);
          oVBoxCart.setVisible(false);
        }
        model.setProperty("/cart", data);
      },
      findTotal(){
        const oModel = this.getOwnerComponent().getModel("cartData")
        const oData = oModel.getProperty("/cart")

        let total=0;

        oData.forEach((each) => total+=each.total)

        return total
      },
      onCheckout() {
        if (!this.oFixedSizeDialog) {
          this.oFixedSizeDialog = new Dialog({
            title: "Bill",
            content: [
              new sap.m.HBox({
                justifyContent: "SpaceBetween",
                alignItems: "Center",

                items: [
                  new sap.m.Title({ text: "Total" }),
                  new sap.m.Text({ text: `${this.findTotal()}` }),
                  
                ],
              }).addStyleClass("myHBoxMargin"),
            ],
            endButton: new Button({
              type: ButtonType.Emphasized,
              text: "Buy",
              press: function () {
                this.oFixedSizeDialog.close();
              }.bind(this),
            }),
          });

          this.getView().addDependent(this.oFixedSizeDialog);
        }

        this.oFixedSizeDialog.open();
      },
    });
  }
);
