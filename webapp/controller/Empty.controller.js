sap.ui.define([
    'com/ey/finn/ap/controller/BaseController'
], function(BaseController){
    'use strict';
    return BaseController.extend("com.ey.finn.ap.controller.Empty",{
        
        onBack : function(){
            // step 1: Get mother object
            var oAppCon = this.getView().getParent();
            // step2 : Navigate to second child using 'to; function 
            // check documnet https://sapui5.hana.ondemand.com/#/api/sap.m.NavContainer%23methods/to
            oAppCon.to("idView1");

        }

    });
});