({
    fireErrorEvent : function(component, message) {
        component.getEvent('showError').setParams({
            message: message
        }).fire();
    },
    filterObjects : function(component, event) {
    	var searchText = event.getParam('params') || '';
        component.find('layoutButtonTable').filterObjects(searchText);
	}
})