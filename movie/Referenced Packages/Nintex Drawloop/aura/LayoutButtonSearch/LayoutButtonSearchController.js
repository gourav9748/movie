({
	filterObjects : function(component, event, helper) {
        helper.filterObjects(component);
	},
    detectEnter : function(component, event, helper) {
        if (event.getParams() && event.getParams().keyCode && event.getParams().keyCode === 13) {
	        helper.filterObjects(component);
        }
    }
})