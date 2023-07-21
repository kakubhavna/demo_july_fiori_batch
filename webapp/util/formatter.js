sap.ui.define([
   
], function() {
    'use strict';
    return {

        getState : function(status){
            switch (status){
                case  'Available':
                    return 'Success';
                    break;
                
                case  'Out Of Stock':
                    return 'Warning';
                    break;
                    
                case  'Discontinued':
                    return 'Error';
                    break;

                default:
                    break;
            }


        }

    }


});