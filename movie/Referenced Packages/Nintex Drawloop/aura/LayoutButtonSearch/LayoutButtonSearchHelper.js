({
	filterObjects : function(component) {
		var event = component.getEvent("actionEvent");
        event.setParams({
            action: 'filterObjects',
            params: component.find("searchText").get("v.value")
        });
        event.fire();
	}
})