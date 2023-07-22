sap.ui.define([
   'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("com.ey.finn.ap.Component",{
        metadata : {
            manifest: "json"

        },
        init:function(){
            // like the constructor of this class 
            // ABAP ->super
            // In JS we can call parent class constructor in child class
          UIComponent.prototype.init.apply(this);

          // router details

          var oRouter = this.getRouter();

          oRouter.initialize();
          

        },
        // createContent: function(){
        //     // we will create UI5 app structure
        //     var oView = new sap.ui.view({
        //         viewName: "com.ey.fin.ap.view.App",
        //         type:"XML"
 
        //     });
        //     // get the object of the container controll
        //     var oAppCon = oView.byId("appCon");

        //     var oView1 = new sap.ui.view({
        //         viewName: "com.ey.fin.ap.view.View1",
        //         type:"XML",
        //         id:"idView1"

        //     });

        //     var oView2 = new sap.ui.view({
        //         viewName: "com.ey.fin.ap.view.View2",
        //         type:"XML",
        //         id:"idView2"

        //     });
        //     var oEmpty= new sap.ui.view({
        //         viewName: "com.ey.fin.ap.view.Empty",
        //         type:"XML",
        //         id:"idEmpty"

        //     });
            
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

        //     return oView;
        // },
        destroy: function(){
            //clean up code
        }

    })
    
});