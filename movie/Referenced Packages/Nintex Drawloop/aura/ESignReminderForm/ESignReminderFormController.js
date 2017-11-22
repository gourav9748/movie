({
    setValues : function(component, event, helper) {
        component.set("v.id", event.getParams().arguments.globalId);
        component.set("v.reminderDelay", event.getParams().arguments.reminderDelay);
        component.set("v.daysTillSigningExpires", event.getParams().arguments.daysTillSigningExpires);
        component.set("v.reminderFrequency", event.getParams().arguments.reminderFrequency);
        component.set("v.warnOfExpiration", event.getParams().arguments.warnOfExpiration);
    },
    updateDocuSignReminders : function(component, event, helper) {
        var updateDocuSignReminders = component.getEvent("updateDocuSignReminders");
        
        var reminderDelay = Number(component.find("reminderDelay").getElement().value);
        var daysTillSigningExpires = Number(component.find("daysTillSigningExpires").getElement().value);
        var reminderFrequency = Number(component.find("reminderFrequency").getElement().value);
        var warnOfExpiration = Number(component.find("warnOfExpiration").getElement().value);
        
        updateDocuSignReminders.setParams({
            globalId: component.get("v.id"),
            reminderDelay: reminderDelay,
            daysTillSigningExpires: daysTillSigningExpires,
            reminderFrequency: reminderFrequency,
            warnOfExpiration: warnOfExpiration
        });
        updateDocuSignReminders.fire();
        
        component.getEvent("slideOutDocuSignReminders").fire();
    },
	cancel : function(component, event, helper) {
        component.getEvent("slideOutDocuSignReminders").fire();
    }
})