({
    onInit : function(component, event, helper) {
        var checkAuthentication = component.get("c.checkAuthentication");
        checkAuthentication.setParams({
            domain: component.get("v.loopUrl") ? component.get("v.loopUrl") : ""
        });
        checkAuthentication.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.oAuthUrl", parsedResponse.oAuthUrl);
                }
                else {
                    helper.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
            else {
                helper.fireErrorEvent(component, 'There was a problem retrieving sample Document Package metadata.');
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
        window.Drawloop.eventListener.addEventListener('sampleDdp', function(event) {
            var sessionId = JSON.parse(event.data.payload).sessionId;
            component.set("v.sessionId", sessionId);

            var authorizedEvent = component.getEvent('actionEvent');
            authorizedEvent.setParams({
                action: 'authorized'
            });
            authorizedEvent.fire();
        });

        window.open(component.get("v.oAuthUrl"), 'Salesforce Auth', 'height=811,width=680,location=0,status=0,titlebar=0');
    },
	handleActionEvent : function(component, event, helper) {
        var action = event.getParam('action');
        
        switch (action) {
            case 'filterDdps':
                helper.filterDdps(component, event);
                break;
            default:
                break;
        }
	},
    save : function(component, event, handler) {
        component.find('sampleDdpTable').save();
    }
})