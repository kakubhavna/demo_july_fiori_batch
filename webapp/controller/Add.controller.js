sap.ui.define([
    'com/ey/finn/ap/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
], function(BaseController,JSONModel,MessageBox,MessageToast,Fragment){
    'use strict';
    return BaseController.extend("com.ey.finn.ap.controller.Add",{
        onInit: function (){
            //create a local json model which will hold the payload 
            //of the data which we need to sent to backend sap system
            this.oLocalModel = new JSONModel();
            this.oLocalModel.setData({
                prodData: {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000067",
                    "SUPPLIER_NAME" : "Florida Holiday Company",
                    "TAX_TARIF_CODE" : "1 ",
                    "MEASURE_UNIT" : "EA",
                    "PRICE" : "0.00",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "CM"
                
                }
            });
            this.getView().setModel(this.oLocalModel,"prod");
        },
        mode: "Create",
        setMode:function (sMode) {
            this.mode= sMode;
            if(this.mode === "Create"){
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("prodId").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
            }else{
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("prodId").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
            }
        },
        onDelete: function(){
            // step1: built path for deletion 
            var sPath = "/ProductSet('" +  this.productId + "')";
            // step2 : get odata model object 
            var oDataModel = this.getView().getModel();
            // step3: use the object to fire delete 
            var that = this;
            oDataModel.remove(sPath,{
                success: function () {
                      // step 4: call backs
                    MessageToast.show("The product has been deleted");
                    that.onClear();
                }

            });

        },
        onExpLoad: function () {

            // step1: get the odata model object 
            var oDataModel = this.getView().getModel();
            //step2: read the category value
            var sCategory = this.oLocalModel.getProperty("/prodData/CATEGORY");
            //step3: call fucntion - get most exp prod
            var that = this;
            oDataModel.callFunction("/GetMostExpPrd",{
                urlParameters: {
                    I_CATGRY: sCategory

                },
                success:function(data){
                    //step4: ser data to UI
                    that.setMode("update");
                    that.oLocalModel.setProperty("/prodData",data);
                },
                error:function(oError){
                    MessageBox.error("An internal error occured")
                },
                
            })
         
        },
        oSupplierPopup:null,
        onF4Help: function () {
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
                          path:'/SupplierSet',
                          template: new sap.m.DisplayListItem({
                              label:'{COMPANY_NAME}',
                              value:'{BP_ID}'
                          })

                      });
                      that.oSupplierPopup.setMultiSelect(false);
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

            // step 1: explore sdka nd get the object to find the selected item
            var oSelectedItem  = oEvent.getParameter("selectedItem");
            // step 2: From display list item we will get the label value
            var sSupplierName =  oSelectedItem.getValue();
                // step 3: set this to the input field inside table on which F4 was pressed
                // we already taken the snapshot
            this.oLocalModel.setProperty("/prodData/SUPPLIER_ID",sSupplierName);
            this.getView().byId("idSuppName").setText(oSelectedItem.getLabel());

        },

        onClear: function(){
            this.setMode("Create");
            this.oLocalModel.setProperty("/prodData",
                {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000067",
                    "SUPPLIER_NAME" : "Florida Holiday Company",
                    "TAX_TARIF_CODE" : "1 ",
                    "MEASURE_UNIT" : "EA",  
                    "PRICE" : "0.00",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "CM"
                
                }
            );
        },
        productId : null,
        onEnter: function(oEvent){
            // Step 1: Get the value what user enter in the field
            var  sValue = oEvent.getParameter("value");
            this.productId = sValue;
            // Step2: construct the path for making call
            var sPath = "/ProductSet('"+ sValue  + "')";
            // Step3: get the odata model object 
            var oDataModel = this.getView().getModel();
            //Step 4: Perform the get call by key

            // Allow the call back function to access controller instance
            var that = this;

            oDataModel.read( sPath,{
                success:function(data){
                    //Step5: handle the response - success
                    // Set data to local model , since local model is 2 way binding to ui
                    // the data will show to user
                    that.oLocalModel.setProperty("/prodData",data);
                    that.setMode("Update");
                },

                error:function(oError){
                    //Step6: handle the response - error
                    MessageToast.show("Product not found , please create once !");
                    that.setMode("Create")
                }
            

            });
        },
        onSave: function () {
            //step 1: prepare payload which is in the local model
            var payload = this.getView().getModel("prod").getProperty("/prodData");


            //step2: validation  before we call SAP S/HANA
            if(payload.PRODUCT_ID === "" ){
                MessageBox.error("Please enter a valid Product Id ( e.g. HT-1000))");
                return;
            }


            // step 3: Get the oData model objet - default model

            var oDataModel= this.getView().getModel();

            //step 4:Trigger the POST request 
            if(this.mode==="Update"){
                oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')",payload,{
                    //step 5: success - in case the odata request was successful 
                      success : function (data) {
                          MessageToast.show("Your product has been created successfully");
                      },
                    //step 6: error - in case the odata request was failed
                      error: function (oErr) {
                          MessageBox.error("An error occured - " + JSON.parse(oErr.responseText).error.innererror.errordetails[0].message );
                          
                      }
              });

            }
            else{
                oDataModel.create("/ProductSet",payload,{
                    //step 5: success - in case the odata request was successful 
                      success : function (data) {
                          MessageToast.show("Your product has been created successfully");
                      },
                    //step 6: error - in case the odata request was failed
                      error: function (oErr) {
                          MessageBox.error("An error occured - " + JSON.parse(oErr.responseText).error.innererror.errordetails[0].message );
                          
                      }
              });

            }
           

          

        }


    });
});