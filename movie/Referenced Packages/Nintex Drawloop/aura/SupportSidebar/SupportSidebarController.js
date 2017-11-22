({
    init : function(component, event, helper) {
        var action = component.get("c.getSupportInfo");
        action.setCallback( this, function(response) {
            if (response.getState() === "SUCCESS") {
                var r = JSON.parse(response.getReturnValue());
                component.set("v.orgId", r.orgId);
            } 
        });
        $A.enqueueAction(action);
    },
	loginAccess : function(component, event, helper) {
		window.open("/partnerbt/grantLoginAccess.apexp", "_blank")
	},
    openCase : function(component, event, helper) {
        window.open('https://www.drawloop.com/support/log-a-case/', '_blank');
    }
})