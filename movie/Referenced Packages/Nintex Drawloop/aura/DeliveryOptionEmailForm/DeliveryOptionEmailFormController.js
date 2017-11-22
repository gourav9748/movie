({
	setValues : function(component, event, helper) {
        component.set("v.id", event.getParams().arguments.globalId);
		component.set("v.isHtmlEmail", event.getParams().arguments.isHtmlEmail);
        component.set("v.emailSubject", event.getParams().arguments.emailSubject);
        component.set("v.emailBody", event.getParams().arguments.emailBody);
	},
    updateSlideEmail : function(component, event, helper) {
        var emailSubject = component.find("emailSubject").getElement().value;
        var emailBody = component.get("v.isHtmlEmail") ? component.find("emailRichText").getElement().value : component.find("emailBody").getElement().value;
        
        component.set("v.emailSubject", emailSubject);
        component.set("v.emailBody", emailBody);
        
        var updateSlideEmail = component.getEvent("updateSlideEmail");
        updateSlideEmail.setParams({
            globalId: component.get("v.id"),
            emailSubject: emailSubject,
            emailBody: emailBody
        });
        updateSlideEmail.fire();
        
        component.getEvent("slideOutEditEmail").fire();
    },
    cancel : function(component, event, helper) {
        component.getEvent("slideOutEditEmail").fire();
    }
})