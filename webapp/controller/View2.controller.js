sap.ui.define([
    'com/ey/finn/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController,MessageBox,MessageToast,Fragment,Filter,FilterOperator){
    'use strict';
    return BaseController.extend("com.ey.finn.ap.controller.View2",{
        onInit : function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            // explicityly pass controller object to the event handler
            this.oRouter.getRoute("detail").attachMatched(this.herculise,this);  
        },
        herculise: function(oEvent){
            // extract the variable which we pass to the Route (hash tag)
            var sIndex = oEvent.getParameter("arguments").fruitId;
            // Reconstruct the Path for element Binding
            var sPath = "/" + sIndex;
            // Perform element binding with view2 for view2
            this.getView().bindElement(sPath,{
              
                    expand:"To_Supplier"
            
            });
           
        },
        onSave: function(){
            MessageBox.confirm("would you like to save?",{
                title: "user confirm",
                // by default sap ui5 will not pass this pointer as controller object
                // to the event handler function , we need to explicitly pass it
                onClose: this.onCloseMessage.bind(this),


            });
            
        },

        onCloseMessage: function(state){
            var oView = this.getView();
            if(state==="OK"){
                MessageToast.show("Congrats! your order is created ");

            }else{
                MessageBox.error("Oops! you cancelled it");

            }

        },
        // PBO-ALV
        //IF lo_alv is not bound
        //create object lo_ALV.
        //MessageBox.confirm ("This functionality is under construction")
        oSupplierPopup: null,
        oCitiPopup: null,

        onFilter : function(oEvent){
            var that = this;
              //  MessageBox.confirm("This functionality is under construction")
              if(!this.oSupplierPopup){
                Fragment.load ({
                    id:'supplier',
                    name:'com.ey.finn.ap.fragments.popup',
                    controller: this
                  }).then(function(oDialogBox){
                        that.oSupplierPopup=oDialogBox;
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.setTitle("Suppliers");
                        that.oSupplierPopup.bindAggregation("items",{
                            path:'/suppliers',
                            template: new sap.m.DisplayListItem({
                                label:'{name}',
                                value:'{country}'
                            })

                        });
                        that.oSupplierPopup.open();
                  })

              }else{
                this.oSupplierPopup.open();
              }
          
        },

        onDialogConfirm: function (oEvent) {
            // get the ID of popup so we can differentiate 
            // which fragment let this event to trigger
            var sId = oEvent.getSource().getId();
            if(sId.indexOf("cities") !== - 1){
                // step 1: explore sdka nd get the object to find the selected item
                var oSelectedItem  = oEvent.getParameter("selectedItem");
                // step 2: From display list item we will get the label value
                var sCityName =  oSelectedItem.getLabel();
                 // step 3: set this to the input field inside table on which F4 was pressed
                 // we already taken the snapshot
                this.oFeild.setValue(sCityName);
            }else{
                // step 1: get all the selected values
                var aFilter = [];
                var oSelectedItems = oEvent.getParameter("selectedItems");
                 // step 2: create an array with all the filters
                for (let i = 0; i < oSelectedItems.length; i++) {
                    const element = oSelectedItems[i];
                    var oFilter = new Filter("name", FilterOperator.EQ, element.getLabel());
                    aFilter.push(oFilter);
                }
                //step3: Inject the filter to the table by getting its onject
               this.getView().byId("supplierTab").getBinding("items").filter(aFilter);


            }

        },

        //if lo_alv is not bound
        onF4Request:function(oEvent){
            // step: 1 taking a snapshot of feidl on which F4 was pressed inside the table
            this.oFeild = oEvent.getSource();
            
          //  MessageBox.confirm("This functionality is under construction")
          var that = this;
          if(!this.oCitiPopup){
            Fragment.load ({
                id:'cities',
                name:'com.ey.finn.ap.fragments.popup',
                controller: this
              }).then(function(oDialogBox){
                    // in JS , the call back and promise fucnions will by default not
                    // have access to the 'this' ( global vairable for controller ) pointer
                    // we need to create a COPY of global variable , because a call /promise 
                    // can access a local variable of caller function.
                    that.oCitiPopup=oDialogBox;
                    //since fragment is parasirte , by default it cannot access the data model
                    // of our app, until someone allow a explicit access of the model to this 
                    //parasite (external module). The view can allow access of model to the 
                    //framgent , which is done using addDepend function
                    that.getView().addDependent(that.oCitiPopup);
                    that.oCitiPopup.setTitle("Cities");
                    that.oCitiPopup.setMultiSelect(false);
                    that.oCitiPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.DisplayListItem({
                            label: '{name}',
                            value:'{famousFor}',
                        })
                    });
                    that.oCitiPopup.open();
    
              });
            
          }else {
            this.oCitiPopup.open();
          }
        },

        onBack : function(){
            // step 1: Get mother object
            var oAppCon = this.getView().getParent();
            // step2 : Navigate to second child using 'to; function 
            // check documnet https://sapui5.hana.ondemand.com/#/api/sap.m.NavContainer%23methods/to
            oAppCon.to("idView1");

        }

    });
});