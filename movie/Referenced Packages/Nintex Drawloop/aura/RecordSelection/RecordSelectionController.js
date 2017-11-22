({
    load : function(component, event, helper) {
        component.set("v.loading", true);
        
        // clear data that would not have been cleared out from a previous Document Package selection
        component.set('v.hasErrorOccurred', false);
        component.set('v.errorMessage', '');
        
        var action =  component.get("c.getAvailableRecords");
        action.setParams({
            "ddpId" : event.getParams().arguments.ddpId,
            "ddpLabel" : event.getParams().arguments.ddpLabel,
            "objectName" : event.getParams().arguments.objectName,
            "objectPluralLabel" : event.getParams().arguments.objectPluralLabel
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.records", parsedResponse.records);
                }
                else {
                    helper.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
            else {
                helper.fireErrorEvent(component, "An unexpected error has occurred. Please contact Nintex Drawloop Support if this error persists.");
            }
            
            component.set("v.loading", false);
        });
        $A.enqueueAction(action);
    },
    search : function(component, event, helper) {
        var searchString = event.getParams().arguments.searchString;
        component.find('selectTiles').search(searchString);
    },
    handleError : function(component, event) {
        component.set("v.hasErrorOccurred", true);
        component.set("v.errorMessage", event.getParam("message"));
        event.stopPropagation();
    },
    clearTiles : function(component) {
        component.find("selectTiles").deselectTiles();
    }
})