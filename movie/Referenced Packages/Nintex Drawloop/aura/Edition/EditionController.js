({
    onInit : function(component, event, helper) {
        var checkAuthentication = component.get("c.checkAuthentication");
        checkAuthentication.setParams({
            domain: component.get("v.loopUrl")
        });
        checkAuthentication.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.oAuthUrl", parsedResponse.oAuthUrl);
                    component.set("v.findSubOptionUrl", parsedResponse.findSubOptionUrl);
                }
                else {
                    helper.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
            else {
                helper.fireErrorEvent(component, "An unexpected error has occurred. Please contact Nintex Drawloop Support if this error persists.");
            }
            
            var actionEvent = component.getEvent('actionEvent');
            actionEvent.setParams({
                action: 'doneLoading'
            });
            actionEvent.fire();
        });
        $A.enqueueAction(checkAuthentication);
    },
    startOAuth : function(component, event, helper) {
        window.Drawloop.eventListener.addEventListener('edition', function(event) {
            helper.load(component);

            var authorizedEvent = component.getEvent('actionEvent');
            authorizedEvent.setParams({
                action: 'authorized'
            });
            authorizedEvent.fire();
        });

        var url = event.currentTarget.id === "findSubOptions"
            ? component.get("v.findSubOptionUrl")
            : component.get("v.oAuthUrl");
        window.open(url, "Salesforce Auth", "width=490, height=680");
    },
    save : function(component) {
        var isStandard = component.get('v.isStandard');
        var scheduledDdp = isStandard ? component.get("v.standardScheduledDdp") : component.get("v.businessScheduledDdp");
        var workflowDdp = component.get("v.workflowDdp");
        var componentLibrary = component.get("v.componentLibrary");
        var massDdp = component.get("v.massDdp");
        
        var action = component.get("c.saveServices");
        action.setParams({
            "isStandard" : isStandard,
            "scheduledDdp" : scheduledDdp,
            "workflowDdp" : workflowDdp,
            "componentLibrary" : componentLibrary,
            "massDdp" : massDdp,
            "domain": component.get("v.loopUrl")
        });
        action.setCallback(this, function(response) {
            var moveToNextStep = component.getEvent("moveToNextStep");
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    moveToNextStep.setParams({success: true}).fire();
                    component.getEvent('updateIsStandard').setParams({
                        isStandard: isStandard
                    }).fire();
                }
                else {
                    moveToNextStep.setParams({success: false}).fire();
                    component.getEvent('showError').setParams({
                        message: parsedResponse.errorMessage
                    }).fire();
                }
            } else {
                moveToNextStep.setParams({success: false}).fire();
                var error = response.getError();
                var message = 'There was a problem saving changes.';
                if (error && error[0] && error[0].message) {
					message = response.getError()[0].message;
                }
                component.getEvent('showError').setParams({
                    message: message
                }).fire();
            }
        });
        $A.enqueueAction(action);
    },
    toggleServiceLevel : function(component, event, helper) {
        var isStandard = component.get("v.isStandard");
        helper.clearServices(component);
        component.set("v.isStandard", !isStandard);
    },
    redirectPage : function(component, event) {
        var redirectEvent = component.getEvent("redirectPage");
        redirectEvent.setParams({
            'buttonName' : 'purchaseForm'
        });
        redirectEvent.fire();
    }
})