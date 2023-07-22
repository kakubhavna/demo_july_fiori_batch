sap.ui.define([
    'com/ey/finn/ap/controller/BaseController',
    'com/ey/finn/ap/util/formatter',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController,Formatter, Filter, FilterOperator){
    'use strict';
    return BaseController.extend("com.ey.finn.ap.controller.View1",{
        formatter : Formatter,
        onInit: function() {
            
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        onNext: function (sIndex) {
            // step 1: Get mother object
         //   var oAppCon = this.getView().getParent().getParent();
            // step2 : Navigate to second child using 'to; function 
            // check documnet https://sapui5.hana.ondemand.com/#/api/sap.m.NavContainer%23methods/to
          //  oAppCon.toDetail("idView2");

            // router

       //     var oRouter = this.getOwnerComponent().getRouter();

           this.oRouter.navTo("detail",{
                fruitId: sIndex

           });
        },
        onAdd: function () {
            this.oRouter.navTo("addProduct");
        },
        onItemSelect: function (oEvent) {
            // Step 1: get the object of the selected item 
            var oSelectedItem = oEvent.getParameter("listItem");

            // step 2 :  Get the path of the element that was selected

            var sPath = oSelectedItem.getBindingContextPath();
            //Step 3: Gte the object of view 2 

        //     // new add this for master view since there is 1 more level
        //     var oAppCon = this.getView().getParent().getParent();

        //    var oView2 = oAppCon.getDetailPages()[1];
        //     // step 4: Bind whole of second view with element

        //   oView2.bindElement(sPath);

        
            //----- /fruit/12 ===>["fruit","12"] - take last element from the array
            //since it start from 0 we use -1
            var sIndex = sPath.split("/")[sPath.split("/").length-1];


           this.onNext(sIndex);   
        },
        onSearch: function (oEvent) {
            // step1 : what did user type to search
            var sText= oEvent.getParameter("query");
            //step2 : construct a filter object to search data
            var oFilter1 = new Filter("CATEGORY",FilterOperator.Contains,sText);
         //   var oFilter2 = new Filter("type",FilterOperator.Contains,sText);

            //step:3 : Gte list control object 

            var oList  = this.getView().byId("idFruits")
            // step 5: create a string for OR
         //   var aFilter = [oFilter1,oFilter2];

            // step 6 : construct a new filter with OR condition
          //      var oFilter = new Filter({
          //          filters : aFilter,
          //          and : false
         //       });
            // step 4: Inject the filter to filter items default is and 
            oList.getBinding("items").filter(oFilter1);
            //--------

            // step1 : value of search feild 
            //Documentation https://sapui5.hana.ondemand.com/#/api/sap.m.SearchField%23events/search
        //    var sValue = oEvent.getParameter("query");
            // Step 2a : Set this value dynamically as title for the view2 
       //   var oView2 =  this.getView().getParent().getPages()[1];
          
           // step 3: Change titile of the second page dynamically
            //getContent- View has default content -- content aggregration --then page / so get Content and then [0]means page as per XML
     //       oView2.getContent()[0].setTitle(sValue);

            // call navigation action directly here
     //       this.onNext();
        },
        onDelete:function(oEvent){
            //step1: we need to know the object of the item on which the delete was pressed
            var oListItem = oEvent.getParameter("listItem");

            // step2:  Get the object of the list control
            // this  option is dependent of id base- avoid if possible
            //this.getView().byId("idList");
            var oList = oEvent.getSource();

            // step3: call the delete item for list and pass the object which needs to be deleted
            oList.removeItem(oListItem);
        },
        onDeleteMultiple: function(oEvent){
            // Step 1: get list object 
            var oList  = this.getView().byId("idFruits")
            //step 2 :get all selected item - multiple
           var aItems =  oList.getSelectedItems();
            //step3: Loop over every item and delete one by one
            for( let i=0 ; i < aItems.length; i++){
                const element = aItems[i];
                oList.removeItem(element);
            }

        },
        onOrder: function(){

                this.onNext();

        }

    });
});